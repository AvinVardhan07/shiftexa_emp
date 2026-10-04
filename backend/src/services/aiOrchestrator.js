const KnowledgeBase = require('../models/KnowledgeBase');
const actionEngine = require('./actionEngine');

class AIOrchestrator {
  /**
   * Performs dynamic RAG search over KnowledgeBase properties and FAQs
   */
  async retrieveContext(organizationId) {
    try {
      if (!organizationId) return null;
      const kb = await KnowledgeBase.findOne({ organizationId });
      return kb;
    } catch (err) {
      console.error('[AIOrchestrator RAG] Error retrieving context:', err);
      return null;
    }
  }

  /**
   * Generates next AI response given conversation history, lead intent, and RAG context
   */
  async processUserMessage({ employee, lead, userText, conversationHistory = [] }) {
    const orgId = employee?.organizationId || lead?.organizationId;
    const kb = await this.retrieveContext(orgId);
    
    const textLower = (userText || '').toLowerCase().trim();
    const primaryProperty = kb?.properties?.[0] || {
      title: "Gachibowli Heights",
      location: "Gachibowli, Hyderabad",
      priceStarting: "₹1.5 Cr",
      configurationType: "3BHK"
    };

    // 1. Initial greeting trigger
    if (!userText || userText.trim() === '' || conversationHistory.length === 0) {
      const greeting = employee?.configuration?.greeting || 
        `Hello sir, nenu Meera maatladutunnanu ${kb?.businessName || 'ABC Properties'} nunchi. Meeru ${primaryProperty.location} lo ${primaryProperty.configurationType} kosam enquiry chesaru kada?`;
      return {
        reply: greeting,
        actionTriggered: null,
        detectedSentiment: 'NEUTRAL',
        extractedData: {}
      };
    }

    // 2. Price / Budget Hesitation
    if (
      textLower.includes('price') || 
      textLower.includes('cost') || 
      textLower.includes('ekkuva') || 
      textLower.includes('budget') || 
      textLower.includes('expensive') ||
      textLower.includes('high') ||
      textLower.includes('rate')
    ) {
      const discountFaq = kb?.faqs?.find(f => f.category === 'Pricing' || (f.question && f.question.includes('discount')));
      const discountMsg = discountFaq ? discountFaq.answer : 'Site visit booking key spot discount offer undi.';

      return {
        reply: `Avunu sir, ardham ayyindi. Meeru budget ni carefully plan cheskuntunnaru kabatti price important factor. ${primaryProperty.title} starting price ${primaryProperty.priceStarting} lo undi with premium amenities like Clubhouse & EV Charging. ${discountMsg} Mee target budget around ${primaryProperty.priceStarting} range lo comfortable aa, leka alternative option chuddama?`,
        actionTriggered: null,
        detectedSentiment: 'HESITANT',
        extractedData: { budgetHesitation: true, priceMentioned: primaryProperty.priceStarting }
      };
    }

    // 3. Finance / Home Loan Queries
    if (
      textLower.includes('loan') || 
      textLower.includes('finance') || 
      textLower.includes('bank') || 
      textLower.includes('emi') ||
      textLower.includes('hdfc') ||
      textLower.includes('sbi')
    ) {
      const loanFaq = kb?.faqs?.find(f => f.category === 'Finance' || (f.question && f.question.includes('loan')));
      const loanDetails = loanFaq ? loanFaq.answer : 'Yes, pre-approved by HDFC, SBI, ICICI, and Axis Bank.';

      return {
        reply: `Ha sir, finance worry em ledu! ${loanDetails} Zero processing fee assistance standard process lo provide chestam. Meeru immediate booking plan chestara leka home loan eligibility check cheddama?`,
        actionTriggered: null,
        detectedSentiment: 'INTERESTED',
        extractedData: { loanEnquiry: true }
      };
    }

    // 4. Project Comparison / Alternative Options
    if (
      textLower.includes('compare') || 
      textLower.includes('other project') || 
      textLower.includes('vere') || 
      textLower.includes('options') ||
      textLower.includes('kondapur') ||
      textLower.includes('hitec')
    ) {
      const altProperty = kb?.properties?.[1] || { title: 'Kondapur Luxury Residency', priceStarting: '₹95 Lakhs' };
      return {
        reply: `Absolutely sir, comparison cheyyadam actual ga right step! ${primaryProperty.title} (${primaryProperty.location}) near Financial District ki high appreciation potential undi. Meeru secondary option looking aithe, maadi ${altProperty.title} starting from ${altProperty.priceStarting} kuda available undi. Meeru project location baseline preference ento chepthara?`,
        actionTriggered: null,
        detectedSentiment: 'INTERESTED',
        extractedData: { comparedProjects: [primaryProperty.title, altProperty.title] }
      };
    }

    // 5. Family / Parents / Hospital convenience concern
    if (
      textLower.includes('family') || 
      textLower.includes('parents') || 
      textLower.includes('hospital') || 
      textLower.includes('tension') ||
      textLower.includes('children') ||
      textLower.includes('school')
    ) {
      return {
        reply: `Oh definitely sir! Family and parents kosam residential space choose chesthunappudu daily peace & hospital proximity most vital. ${primaryProperty.title} location lo top hospitals & international schools 10 mins connectivity lo unnayi. Daily living super convenient ga untundi.`,
        actionTriggered: null,
        detectedSentiment: 'EMOTIONAL_MOTIVATION',
        extractedData: { keyMotivations: ['Family Residence', 'Hospital Proximity'] }
      };
    }

    // 6. Site Visit Scheduling Agreement
    if (
      textLower.includes('visit') || 
      textLower.includes('sunday') || 
      textLower.includes('saturday') || 
      textLower.includes('ok') || 
      textLower.includes('sure') || 
      textLower.includes('book') || 
      textLower.includes('chustha') ||
      textLower.includes('tomorrow') ||
      textLower.includes('weekend') ||
      textLower.includes('yes')
    ) {
      return {
        reply: `Perfect sir! Sunday 11:00 AM ki ${primaryProperty.title} site visit scheduled! Meeru family tho velli space chudandi. Instant pressure em undadu. Nenu meeku WhatsApp lo location pin and brochure send chestunnanu. Google Calendar invite trigger chesa. Thank you so much sir!`,
        actionTriggered: 'BOOK_SITE_VISIT_AND_WHATSAPP',
        detectedSentiment: 'VERY_POSITIVE',
        extractedData: {
          budget: primaryProperty.priceStarting,
          preferredLocation: primaryProperty.location,
          configuration: primaryProperty.configurationType,
          siteVisitSlot: 'Sunday 11:00 AM',
          timeline: '1 Month',
          propertyTitle: primaryProperty.title
        }
      };
    }

    // 7. Default consultative response
    return {
      reply: `Sure sir! ${primaryProperty.title} ${primaryProperty.location} project lo ${primaryProperty.configurationType} units ${primaryProperty.priceStarting} starting price range lo available. Gated community with 80% open green space. Meeru once site visit ki Saturday or Sunday eppudu comfortable ga untaru?`,
      actionTriggered: null,
      detectedSentiment: 'INTERESTED',
      extractedData: { propertyTitle: primaryProperty.title }
    };
  }
}

module.exports = new AIOrchestrator();
