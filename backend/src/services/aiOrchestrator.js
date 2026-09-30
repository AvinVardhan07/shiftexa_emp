const actionEngine = require('./actionEngine');
const KnowledgeBase = require('../models/KnowledgeBase');

class AIOrchestrator {
  /**
   * Generates next AI response given conversation history and lead intent
   */
  async processUserMessage({ employee, lead, userText, conversationHistory = [] }) {
    const textLower = userText.toLowerCase();

    // 1. Initial greeting trigger
    if (!userText || userText.trim() === '' || conversationHistory.length === 0) {
      const greeting = employee?.configuration?.greeting || 
        "Hello sir, nenu Meera maatladutunnanu ABC Properties nunchi. Meeru Gachibowli lo 3BHK kosam enquiry chesaru kada?";
      return {
        reply: greeting,
        actionTriggered: null,
        detectedSentiment: 'NEUTRAL'
      };
    }

    // 2. Price / Budget Hesitation
    if (textLower.includes('price') || textLower.includes('cost') || textLower.includes('ekkuva') || textLower.includes('budget') || textLower.includes('expensive')) {
      return {
        reply: "Avunu sir, ardham ayyindi. Meeru budget ni carefully plan cheskuntunnaru kabatti price important factor ani naaku ardham avuthundi. Just apartment nachindani immediate ga decision teesukovalsina avasaram ledu. Meeru comfortable ga undela options chuddam. Mee budget around 1.5 crore kada? Adhe final limit aa, leka konchem flexibility unda?",
        actionTriggered: null,
        detectedSentiment: 'HESITANT'
      };
    }

    // 3. Comparing with other projects
    if (textLower.includes('compare') || textLower.includes('other project') || textLower.includes('vere') || textLower.includes('options')) {
      return {
        reply: "Absolutely sir, meeru compare cheyyadam actually manchi decision. Property ante small purchase kaadu kada. Meeru compare chesthunappudu price okkate chudakandi. Location, construction quality, amenities, possession timeline, and future connectivity kuda consider cheyyandi. Meeru already vere project shortlist chesara?",
        actionTriggered: null,
        detectedSentiment: 'INTERESTED'
      };
    }

    // 4. Family / Parents / Hospital convenience concern
    if (textLower.includes('family') || textLower.includes('parents') || textLower.includes('hospital') || textLower.includes('tension')) {
      return {
        reply: "Oh okay sir, appudu definitely decision konchem important avuthundi. Meeru family kosam chusthunnaru kabatti, just apartment size kanna daily convenience and location urgent. Gachibowli location lo Financial District and top hospitals 10 mins distance lo unnayi. Mee parents ki daily convenience & medical emergency ki super easy ga untundi.",
        actionTriggered: null,
        detectedSentiment: 'EMOTIONAL_MOTIVATION'
      };
    }

    // 5. Agreeing to site visit / Weekend booking
    if (textLower.includes('visit') || textLower.includes('sunday') || textLower.includes('saturday') || textLower.includes('ok') || textLower.includes('sure') || textLower.includes('book') || textLower.includes('chustha')) {
      return {
        reply: "Perfect sir! Sunday 11:00 AM ki site visit scheduled. Meeru family tho velli personally chusi, space nachithe next step discuss cheddam. Immediate decision pressure em ledu. Nenu mee WhatsApp ki location & brochure block pampistanu. Thank you sir!",
        actionTriggered: 'BOOK_SITE_VISIT_AND_WHATSAPP',
        detectedSentiment: 'VERY_POSITIVE',
        extractedData: {
          budget: '₹1.5 Crore',
          location: 'Gachibowli',
          configuration: '3BHK',
          siteVisitSlot: 'Sunday 11:00 AM',
          timeline: '1 Month'
        }
      };
    }

    // Default consultative response
    return {
      reply: "Sure sir. ABC Properties Gachibowli project lo 3BHK 1850 sqft units 1.5 Cr starting price lo available unnayi. High appreciation potential and peaceful gated community. Meeru once site visit ki eppudu comfortable ga untaru?",
      actionTriggered: null,
      detectedSentiment: 'INTERESTED'
    };
  }
}

module.exports = new AIOrchestrator();
