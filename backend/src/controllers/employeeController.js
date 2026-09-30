const Employee = require('../models/Employee');
const EmployeeTemplate = require('../models/EmployeeTemplate');
const EmployeeVersion = require('../models/EmployeeVersion');
const KnowledgeBase = require('../models/KnowledgeBase');
const Lead = require('../models/Lead');
const Call = require('../models/Call');
const voiceProvider = require('../services/voiceProvider');
const aiOrchestrator = require('../services/aiOrchestrator');
const postCallWorker = require('../services/postCallWorker');

exports.hireEmployee = async (req, res, next) => {
  try {
    const { templateId, name } = req.body;
    const organizationId = req.organizationId;

    if (!organizationId) {
      return res.status(400).json({ success: false, message: 'Organization ID is required' });
    }

    const template = await EmployeeTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Employee template not found' });
    }

    // Create Hired Employee Instance
    const employee = await Employee.create({
      organizationId,
      templateId: template._id,
      name: name || `${template.name} - ${req.organizationId ? 'ABC Properties' : 'Sales'}`,
      status: 'READY',
      takingCalls: true,
      phoneNumber: '+91 40 4892 1100',
      configuration: {
        language: template.defaultLanguage,
        regionalStyle: template.defaultStyle,
        formality: 'Casual Professional',
        salesApproach: 'Consultative & Helpful',
        greeting: template.defaultGreeting || 'Hello sir, nenu Meera maatladutunnanu ABC Properties nunchi. Meeru Gachibowli lo 3BHK kosam enquiry chesaru kada?'
      }
    });

    // Create Initial Version 1
    const initialVersion = await EmployeeVersion.create({
      employeeId: employee._id,
      organizationId,
      versionNumber: 1,
      status: 'PUBLISHED',
      greeting: employee.configuration.greeting,
      instructions: template.defaultSystemRules || 'Natural Telugu + English Hyderabad sales advisor',
      qualificationRules: template.defaultQualificationQuestions || ['Budget', 'Location', 'Timeline'],
      publishedBy: req.user._id,
      publishedAt: new Date()
    });

    employee.publishedVersionId = initialVersion._id;
    employee.status = 'LIVE';
    await employee.save();

    // Create default KnowledgeBase for ABC Properties if Meera
    let kb = await KnowledgeBase.findOne({ organizationId });
    if (!kb) {
      kb = await KnowledgeBase.create({
        organizationId,
        employeeId: employee._id,
        businessName: 'ABC Properties',
        businessOverview: 'Premium real estate developer in Hyderabad',
        properties: [
          {
            title: 'Gachibowli Heights',
            location: 'Gachibowli, Hyderabad',
            configurationType: '3BHK',
            priceStarting: '₹1.5 Cr',
            priceRangeMax: '₹1.8 Cr',
            squareFeet: '1850 - 2100 sqft',
            possessionDate: 'December 2026',
            amenities: ['Clubhouse', 'Swimming Pool', 'EV Charging Station', '24/7 Security'],
            description: 'Luxury 3BHK high-rise apartments near Financial District with 80% open green space.'
          },
          {
            title: 'Kondapur Luxury Residency',
            location: 'Kondapur, Hyderabad',
            configurationType: '2BHK & 3BHK',
            priceStarting: '₹95 Lakhs',
            priceRangeMax: '₹1.4 Cr',
            squareFeet: '1350 - 1750 sqft',
            possessionDate: 'June 2026',
            amenities: ['Gym', 'Children Play Area', 'Power Backup'],
            description: 'Modern gated community close to Google & Botanical Garden.'
          }
        ],
        faqs: [
          { question: 'What is the booking discount?', answer: 'We offer a spot discount up to ₹2 Lakhs upon site visit booking.', category: 'Pricing' },
          { question: 'Is home loan approval available?', answer: 'Yes, pre-approved by HDFC, SBI, ICICI, and Axis Bank.', category: 'Finance' }
        ]
      });
    }

    res.status(201).json({
      success: true,
      employee,
      publishedVersion: initialVersion,
      knowledgeBase: kb
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrganizationEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({ organizationId: req.organizationId })
      .populate('templateId')
      .populate('publishedVersionId')
      .sort({ createdAt: -1 });

    res.json({ success: true, employees });
  } catch (err) {
    next(err);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, organizationId: req.organizationId })
      .populate('templateId')
      .populate('publishedVersionId');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const versions = await EmployeeVersion.find({ employeeId: employee._id }).sort({ versionNumber: -1 });
    const knowledgeBase = await KnowledgeBase.findOne({ organizationId: req.organizationId });

    res.json({
      success: true,
      employee,
      versions,
      knowledgeBase
    });
  } catch (err) {
    next(err);
  }
};

exports.updateEmployeeConfig = async (req, res, next) => {
  try {
    const { configuration, name, takingCalls } = req.body;
    const employee = await Employee.findOne({ _id: req.params.id, organizationId: req.organizationId });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    if (name) employee.name = name;
    if (typeof takingCalls === 'boolean') employee.takingCalls = takingCalls;
    if (configuration) {
      employee.configuration = { ...employee.configuration, ...configuration };
    }

    await employee.save();
    res.json({ success: true, employee });
  } catch (err) {
    next(err);
  }
};

exports.publishVersion = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, organizationId: req.organizationId });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const newVersionNum = (employee.currentDraftVersion || 1) + 1;
    const publishedVersion = await EmployeeVersion.create({
      employeeId: employee._id,
      organizationId: req.organizationId,
      versionNumber: newVersionNum,
      status: 'PUBLISHED',
      greeting: employee.configuration.greeting,
      instructions: employee.configuration.customInstructions || 'Hyderabad real estate consultative AI',
      qualificationRules: ['Budget >= ₹1.0Cr', 'Gachibowli/Kondapur location preference', 'Site visit slot booking'],
      publishedBy: req.user._id,
      publishedAt: new Date()
    });

    employee.publishedVersionId = publishedVersion._id;
    employee.currentDraftVersion = newVersionNum;
    employee.status = 'LIVE';
    employee.takingCalls = true;
    await employee.save();

    res.json({ success: true, employee, version: publishedVersion });
  } catch (err) {
    next(err);
  }
};

exports.startTestCall = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, organizationId: req.organizationId }).populate('templateId');
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Find or create Rahul Sharma test lead
    let lead = await Lead.findOne({ organizationId: req.organizationId, phone: '+91 98765 43210' });
    if (!lead) {
      lead = await Lead.create({
        organizationId: req.organizationId,
        assignedEmployeeId: employee._id,
        name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        email: 'rahul.sharma@example.com',
        source: 'Website Form Enquiry',
        status: 'NEW'
      });
    }

    // Call Voice Provider
    const callSession = await voiceProvider.createCall({ employee, lead, direction: 'TEST' });

    // Create Call record
    const call = await Call.create({
      organizationId: req.organizationId,
      employeeId: employee._id,
      leadId: lead._id,
      providerCallId: callSession.providerCallId,
      direction: 'TEST',
      status: 'IN_PROGRESS',
      recordingUrl: 'https://cdn.shiftexa.com/recordings/sample_meera_call.mp3',
      transcript: [
        { speaker: 'Meera', text: employee.configuration.greeting || 'Hello sir, nenu Meera maatladutunnanu ABC Properties nunchi. Meeru Gachibowli lo 3BHK kosam enquiry chesaru kada?', timestamp: '00:01' }
      ]
    });

    res.json({
      success: true,
      callId: call._id,
      providerCallId: callSession.providerCallId,
      initialGreeting: call.transcript[0].text,
      lead: { name: lead.name, phone: lead.phone }
    });
  } catch (err) {
    next(err);
  }
};

exports.interactTestCall = async (req, res, next) => {
  try {
    const { callId, message } = req.body;
    const call = await Call.findById(callId).populate('employeeId leadId');

    if (!call) {
      return res.status(404).json({ success: false, message: 'Call session not found' });
    }

    // Add user message to transcript
    call.transcript.push({
      speaker: 'Customer',
      text: message,
      timestamp: `00:${String(call.transcript.length * 5).padStart(2, '0')}`
    });

    // Process via AI Orchestrator
    const aiResponse = await aiOrchestrator.processUserMessage({
      employee: call.employeeId,
      lead: call.leadId,
      userText: message,
      conversationHistory: call.transcript
    });

    // Add AI response to transcript
    call.transcript.push({
      speaker: 'Meera',
      text: aiResponse.reply,
      timestamp: `00:${String(call.transcript.length * 5 + 3).padStart(2, '0')}`
    });

    await call.save();

    // If call reached conclusion or site visit booked, trigger post-call worker automatically
    let isCompleted = false;
    if (aiResponse.actionTriggered === 'BOOK_SITE_VISIT_AND_WHATSAPP' || call.transcript.length >= 8) {
      isCompleted = true;
      call.durationSeconds = 118; // ~2 minutes
      await call.save();
      await postCallWorker.processCompletedCall(call._id);
    }

    res.json({
      success: true,
      reply: aiResponse.reply,
      actionTriggered: aiResponse.actionTriggered,
      isCompleted,
      transcript: call.transcript
    });
  } catch (err) {
    next(err);
  }
};
