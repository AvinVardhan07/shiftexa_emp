const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const connectDB = require('../config/db');

const User = require('../models/User');
const Organization = require('../models/Organization');
const Membership = require('../models/Membership');
const EmployeeTemplate = require('../models/EmployeeTemplate');
const Employee = require('../models/Employee');
const EmployeeVersion = require('../models/EmployeeVersion');
const KnowledgeBase = require('../models/KnowledgeBase');
const Lead = require('../models/Lead');
const Call = require('../models/Call');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Seeding Shiftexa database...');

    // 1. Seed Employee Templates
    await EmployeeTemplate.deleteMany({});
    const meeraTemplate = await EmployeeTemplate.create({
      code: 'meera',
      name: 'Meera',
      title: 'AI Real Estate Sales Employee',
      role: 'Sales Representative',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      category: 'Real Estate',
      description: 'Specialized in Indian real estate lead qualification, Telugu + English Hyderabad conversational dialogue, objection handling, project pricing, site visit scheduling, and automated WhatsApp follow-ups.',
      shortDescription: 'Qualifies property leads, answers project FAQs, and books site visits in Telugu & English.',
      capabilities: [
        'Natural Telugu + English (Hyderabad code-switching)',
        'Budget & location qualification',
        'Empathy & price hesitation handling',
        'Google Calendar site visit slot booking',
        'WhatsApp brochure & confirmation sending',
        'Structured lead extraction & CRM updates'
      ],
      supportedLanguages: ['Telugu', 'English', 'Hinglish'],
      defaultLanguage: 'Telugu + English (Hyderabad)',
      defaultStyle: 'Hyderabad Casual Professional',
      ratePerMin: 3.50,
      isFeatured: true,
      defaultGreeting: 'Hello sir, nenu Meera maatladutunnanu ABC Properties nunchi. Meeru Gachibowli lo 3BHK kosam enquiry chesaru kada?',
      defaultSystemRules: 'Always maintain a consultative, polite Indian accent Telugu+English tone. Never sound pushy or robotic. Handle price hesitations with empathy before softly closing for a site visit.',
      defaultQualificationQuestions: [
        'Budget limit and flexibility',
        'Preferred location & connectivity',
        'Buying purpose (Self-use / Investment)',
        'Family/Parents convenience preferences',
        'Target possession timeline'
      ]
    });

    const riyaTemplate = await EmployeeTemplate.create({
      code: 'riya',
      name: 'Riya',
      title: 'AI Receptionist & Appointment Caller',
      role: 'Front Desk Representative',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      category: 'Reception & Desk',
      description: 'Handles inbound desk calls, screens inquiries, routes calls to team members, and manages calendar appointments.',
      shortDescription: 'Answers inbound calls, identifies caller needs, and schedules meetings.',
      capabilities: ['Inbound call routing', 'FAQ answering', 'Appointment booking'],
      supportedLanguages: ['English', 'Hindi'],
      ratePerMin: 3.00,
      isFeatured: false
    });

    const anuTemplate = await EmployeeTemplate.create({
      code: 'anu',
      name: 'Anu',
      title: 'AI Education Admissions Specialist',
      role: 'Admissions Officer',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      category: 'Education',
      description: 'Counsels prospective students, collects academic requirements, explains course fee structures, and schedules campus visits.',
      shortDescription: 'Handles student admission inquiries, collects requirements, and schedules counseling.',
      capabilities: ['Course counseling', 'Eligibility screening', 'Campus visit booking'],
      supportedLanguages: ['English', 'Telugu', 'Hindi'],
      ratePerMin: 3.50,
      isFeatured: false
    });

    const nishaTemplate = await EmployeeTemplate.create({
      code: 'nisha',
      name: 'Nisha',
      title: 'AI Recruitment Screener',
      role: 'Talent Acquisition',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      category: 'Recruitment',
      description: 'Screens job applicant phone leads, verifies notice period & CTC expectations, and schedules technical interviews.',
      shortDescription: 'Screens job candidates and schedules interview loops.',
      capabilities: ['Notice period verification', 'CTC salary check', 'Interview scheduling'],
      supportedLanguages: ['English', 'Hindi'],
      ratePerMin: 3.50,
      isFeatured: false
    });

    const mayaTemplate = await EmployeeTemplate.create({
      code: 'maya',
      name: 'Maya',
      title: 'AI Customer Support Specialist',
      role: 'Support Desk Agent',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      category: 'Customer Support',
      description: 'Answers post-sales questions, resolves support tickets, collects issue diagnostics, and escalates to human agents.',
      shortDescription: 'Handles customer support queries and resolves tickets.',
      capabilities: ['Troubleshooting FAQs', 'Ticket creation', 'Human escalation'],
      supportedLanguages: ['English', 'Hindi', 'Telugu'],
      ratePerMin: 3.25,
      isFeatured: false
    });

    // 2. Create Demo User & Organization (ABC Properties)
    let user = await User.findOne({ email: 'demo@shiftexa.com' });
    if (!user) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      user = await User.create({
        name: 'Demo Admin',
        email: 'demo@shiftexa.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      });
    }

    let org = await Organization.findOne({ slug: 'abc-properties' });
    if (!org) {
      org = await Organization.create({
        name: 'ABC Properties',
        slug: 'abc-properties',
        industry: 'Real Estate Sales',
        location: 'Hyderabad, Telangana',
        phone: '+91 40 4892 1100',
        website: 'https://abcproperties.com',
        apiKey: 'shiftexa_live_abcproperties_2026_key'
      });

      await Membership.create({
        userId: user._id,
        organizationId: org._id,
        role: 'OWNER'
      });
    }

    // 3. Create Wallet
    let wallet = await Wallet.findOne({ organizationId: org._id });
    if (!wallet) {
      wallet = await Wallet.create({
        organizationId: org._id,
        balance: 500.00
      });
    }

    // 4. Hire Meera for ABC Properties
    let meeraEmp = await Employee.findOne({ organizationId: org._id, templateId: meeraTemplate._id });
    if (!meeraEmp) {
      meeraEmp = await Employee.create({
        organizationId: org._id,
        templateId: meeraTemplate._id,
        name: 'Meera (Real Estate Sales)',
        status: 'LIVE',
        takingCalls: true,
        phoneNumber: '+91 40 4892 1100',
        configuration: {
          language: 'Telugu + English (Hyderabad)',
          regionalStyle: 'Hyderabad Casual Professional',
          formality: 'Casual Professional',
          salesApproach: 'Consultative & Helpful',
          workingHours: '09:00 AM - 08:00 PM IST',
          greeting: 'Hello sir, nenu Meera maatladutunnanu ABC Properties nunchi. Meeru Gachibowli lo 3BHK kosam enquiry chesaru kada?'
        },
        stats: {
          totalCalls: 12,
          totalMinutes: 28,
          qualifiedLeads: 9,
          siteVisitsBooked: 6
        }
      });

      const ver1 = await EmployeeVersion.create({
        employeeId: meeraEmp._id,
        organizationId: org._id,
        versionNumber: 1,
        status: 'PUBLISHED',
        greeting: meeraEmp.configuration.greeting,
        instructions: 'Natural Telugu + English Hyderabad sales advisor',
        qualificationRules: ['Budget', 'Location', 'Timeline'],
        publishedBy: user._id,
        publishedAt: new Date()
      });

      meeraEmp.publishedVersionId = ver1._id;
      await meeraEmp.save();
    }

    // 5. Seed Knowledge Base for ABC Properties
    let kb = await KnowledgeBase.findOne({ organizationId: org._id });
    if (!kb) {
      kb = await KnowledgeBase.create({
        organizationId: org._id,
        employeeId: meeraEmp._id,
        businessName: 'ABC Properties',
        businessOverview: 'Leading luxury real estate developer in Hyderabad, specializing in high-rise residential communities in Gachibowli and Kondapur.',
        properties: [
          {
            title: 'Gachibowli Heights',
            location: 'Gachibowli, Hyderabad',
            configurationType: '3BHK',
            priceStarting: '₹1.5 Cr',
            priceRangeMax: '₹1.8 Cr',
            squareFeet: '1850 - 2100 sqft',
            possessionDate: 'December 2026',
            amenities: ['Clubhouse', 'Swimming Pool', 'EV Charging', '24/7 Security'],
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
          { question: 'What is the spot booking discount?', answer: 'Spot booking discount up to ₹2 Lakhs upon site visit.', category: 'Pricing' },
          { question: 'Is home loan pre-approved?', answer: 'Yes, pre-approved by HDFC, SBI, ICICI, and Axis Bank.', category: 'Finance' }
        ]
      });
    }

    // 6. Seed Demo Leads & Calls
    let lead1 = await Lead.findOne({ organizationId: org._id, phone: '+91 98765 43210' });
    if (!lead1) {
      lead1 = await Lead.create({
        organizationId: org._id,
        assignedEmployeeId: meeraEmp._id,
        name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        email: 'rahul.sharma@example.com',
        source: 'Website Form Enquiry',
        status: 'SITE_VISIT_BOOKED',
        qualificationData: {
          budget: '₹1.5 Crore',
          preferredLocation: 'Gachibowli',
          configuration: '3BHK',
          timeline: '1 Month',
          buyingPurpose: 'Family / Parents Residence',
          siteVisitDate: 'Sunday 11:00 AM',
          keyMotivations: ['Parents medical convenience', 'Hospital proximity']
        }
      });

      const sampleCall = await Call.create({
        organizationId: org._id,
        employeeId: meeraEmp._id,
        leadId: lead1._id,
        providerCallId: 'call_retell_demo_1001',
        direction: 'OUTBOUND',
        status: 'COMPLETED',
        durationSeconds: 138,
        billedMinutes: 3,
        costPerMin: 3.50,
        totalCost: 10.50,
        recordingUrl: 'https://cdn.shiftexa.com/recordings/meera_rahul_gachibowli.mp3',
        summary: 'Customer Rahul enquired about 3BHK in Gachibowli (Budget ~₹1.5 Cr). Expressed price hesitation and parents medical proximity requirements. Meera provided consultative guidance and successfully booked a site visit for Sunday 11:00 AM. Sent WhatsApp brochure.',
        outcome: 'QUALIFIED_SITE_VISIT_BOOKED',
        transcript: [
          { speaker: 'Meera', text: 'Hello Rahul garu, nenu Meera maatladutunnanu ABC Properties nunchi. Meeru Gachibowli lo 3BHK kosam enquiry chesaru kada?', timestamp: '00:02' },
          { speaker: 'Customer', text: 'Avunu. Kaani price konchem ekkuva anipisthundi.', timestamp: '00:08' },
          { speaker: 'Meera', text: 'Avunu Rahul garu, ardham ayyindi. Meeru budget ni carefully plan cheskuntunnaru kabatti price important factor ani naaku ardham avuthundi. Mee budget around 1.5 crore kada?', timestamp: '00:18' },
          { speaker: 'Customer', text: '1.5 is comfortable. Actually family and parents kosam chusthunna.', timestamp: '00:30' },
          { speaker: 'Meera', text: 'Then Gachibowli location meeku highly useful avvachu. Financial district and major hospitals nearby. Sunday comfortable ga unte site visit arrange cheddama?', timestamp: '00:48' },
          { speaker: 'Customer', text: 'Okay, Sunday 11 AM works.', timestamp: '01:02' },
          { speaker: 'Meera', text: 'Perfect Rahul garu! Sunday 11:00 AM ki site visit booked. WhatsApp lo location link pampinchanu. Thank you!', timestamp: '01:15' }
        ],
        extractedData: {
          budget: '₹1.5 Crore',
          preferredLocation: 'Gachibowli',
          configuration: '3BHK',
          timeline: '1 Month',
          siteVisitSlot: 'Sunday 11:00 AM',
          whatsappSent: true,
          sentiment: 'POSITIVE'
        }
      });

      lead1.lastCallId = sampleCall._id;
      lead1.lastCalledAt = new Date();
      await lead1.save();
    }

    console.log('[Seed] Database seeding completed successfully!');
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
  }
};

module.exports = seedData;

if (require.main === module) {
  seedData().then(() => process.exit(0));
}
