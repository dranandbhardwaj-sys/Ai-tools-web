export const CATEGORIES = [
  { id: 'writing', icon: '✍️', color: '#4F46E5', titleEn: 'AI Writing', titleHi: 'AI लेखन' },
  { id: 'social', icon: '📱', color: '#2563EB', titleEn: 'Social Media Creator', titleHi: 'सोशल मीडिया क्रिएटर' },
  { id: 'marketing', icon: '📣', color: '#9333EA', titleEn: 'Marketing Tools', titleHi: 'मार्केटिंग टूल्स' },
  { id: 'image', icon: '🎨', color: '#EC4899', titleEn: 'AI Image Creator', titleHi: 'AI इमेज क्रिएटर' },
  { id: 'video', icon: '🎬', color: '#F59E0B', titleEn: 'Video Creator', titleHi: 'वीडियो क्रिएटर' },
  { id: 'business', icon: '💼', color: '#10B981', titleEn: 'Business Creator', titleHi: 'बिज़नेस क्रिएटर' },
  { id: 'productivity', icon: '⚡', color: '#06B6D4', titleEn: 'Productivity', titleHi: 'प्रोडक्टिविटी' }
];

export const TOOLS = [
  // AI Writing (14)
  { id: 'ai_blog_writer', cat: 'writing', tier: 'pro', titleEn: 'AI Blog Writer', titleHi: 'AI ब्लॉग राइटर', descEn: 'Create SEO-structured blog posts with headings and takeaways.', descHi: 'हेडिंग और मुख्य बिंदुओं के साथ SEO ब्लॉग पोस्ट लिखें।' },
  { id: 'article_generator', cat: 'writing', tier: 'free', titleEn: 'Article Generator', titleHi: 'आर्टिकल जनरेटर', descEn: 'Draft informative long-form articles on any subject.', descHi: 'किसी भी विषय पर जानकारीपूर्ण आर्टिकल तैयार करें।' },
  { id: 'paragraph_generator', cat: 'writing', tier: 'free', titleEn: 'Paragraph Generator', titleHi: 'पैराग्राफ जनरेटर', descEn: 'Generate clear, cohesive paragraphs from a brief idea.', descHi: 'संक्षिप्त आइडिया से स्पष्ट पैराग्राफ बनाएं।' },
  { id: 'essay_writer', cat: 'writing', tier: 'free', titleEn: 'Essay Writer', titleHi: 'निबंध लेखक (Essay)', descEn: 'Structured essays with introduction, arguments, and conclusion.', descHi: 'प्रस्तावना, मुख्य बिंदु और निष्कर्ष के साथ निबंध लिखें।' },
  { id: 'story_generator', cat: 'writing', tier: 'pro', titleEn: 'Story Generator', titleHi: 'कहानी जनरेटर', descEn: 'Craft engaging short stories, hooks, and character arcs.', descHi: 'रोचक कहानियां और पात्रों की रूपरेखा बनाएं।' },
  { id: 'email_writer', cat: 'writing', tier: 'free', titleEn: 'Email Writer', titleHi: 'ईमेल राइटर', descEn: 'Quick everyday emails with clear subject lines and sign-offs.', descHi: 'स्पष्ट विषय और समापन के साथ तेज़ ईमेल लिखें।' },
  { id: 'professional_email', cat: 'writing', tier: 'pro', titleEn: 'Professional Email', titleHi: 'प्रोफेशनल ईमेल', descEn: 'Executive client outreach, follow-up, and formal replies.', descHi: 'क्लाइंट आउटरीच, फॉलो-अप और औपचारिक ईमेल तैयार करें।' },
  { id: 'letter_writer', cat: 'writing', tier: 'free', titleEn: 'Letter Writer', titleHi: 'पत्र लेखक (Letter)', descEn: 'Formal applications, thank-you letters, and official notices.', descHi: 'औपचारिक आवेदन, धन्यवाद और आधिकारिक पत्र लिखें।' },
  { id: 'rewrite_text', cat: 'writing', tier: 'free', titleEn: 'Rewrite Text', titleHi: 'टेक्स्ट रीराइट', descEn: 'Polish, simplify, or elevate existing drafts cleanly.', descHi: 'मौजूदा टेक्स्ट को बेहतर, सरल या प्रभावी बनाएं।' },
  { id: 'text_summarizer', cat: 'writing', tier: 'free', titleEn: 'Text Summarizer', titleHi: 'टेक्स्ट सारांश', descEn: 'Distill long notes and articles into crisp bullet summaries.', descHi: 'लंबे लेखों और नोट्स का संक्षिप्त बुलेट सारांश बनाएं।' },
  { id: 'grammar_checker', cat: 'writing', tier: 'free', titleEn: 'Grammar Checker', titleHi: 'व्याकरण जांच', descEn: 'Review clarity, punctuation, readability, and polish.', descHi: 'वाक्य स्पष्टता, विराम चिह्न और व्याकरण सुधारें।' },
  { id: 'hindi_to_english', cat: 'writing', tier: 'free', titleEn: 'Hindi to English', titleHi: 'हिन्दी से अंग्रेज़ी', descEn: 'Prepare natural English creator copy from Hindi ideas.', descHi: 'हिन्दी विचारों को सहज अंग्रेज़ी कॉपी में बदलें।' },
  { id: 'english_to_hindi', cat: 'writing', tier: 'free', titleEn: 'English to Hindi', titleHi: 'अंग्रेज़ी से हिन्दी', descEn: 'Localize English drafts into clean, natural Hindi.', descHi: 'अंग्रेज़ी ड्राफ्ट को स्वाभाविक हिन्दी में बदलें।' },
  { id: 'text_translator', cat: 'writing', tier: 'pro', titleEn: 'Text Translator', titleHi: 'टेक्स्ट अनुवादक', descEn: 'Bilingual creator localization for Indian & global audiences.', descHi: 'भारतीय और वैश्विक दर्शकों के लिए द्विभाषी अनुवाद।' },

  // Social Media Creator (11)
  { id: 'instagram_caption', cat: 'social', tier: 'free', titleEn: 'Instagram Caption Generator', titleHi: 'इंस्टाग्राम कैप्शन', descEn: 'Scroll-stopping captions with hooks, value, and CTA.', descHi: 'हुक, वैल्यू और CTA के साथ आकर्षक इंस्टाग्राम कैप्शन।' },
  { id: 'instagram_bio', cat: 'social', tier: 'free', titleEn: 'Instagram Bio Generator', titleHi: 'इंस्टाग्राम बायो', descEn: 'High-converting creator and brand bio ideas.', descHi: 'क्रिएटर और ब्रांड के लिए प्रभावशाली बायो आइडिया।' },
  { id: 'facebook_post', cat: 'social', tier: 'free', titleEn: 'Facebook Post Generator', titleHi: 'फेसबुक पोस्ट', descEn: 'Community-friendly Facebook updates that spark comments.', descHi: 'चर्चा बढ़ाने वाले फेसबुक पोस्ट तैयार करें।' },
  { id: 'youtube_description', cat: 'social', tier: 'pro', titleEn: 'YouTube Description Generator', titleHi: 'यूट्यूब डिस्क्रिप्शन', descEn: 'SEO-ready video descriptions with timestamps & links.', descHi: 'टाइमस्टैम्प और SEO कीवर्ड के साथ यूट्यूब विवरण।' },
  { id: 'youtube_title', cat: 'social', tier: 'free', titleEn: 'YouTube Title Generator', titleHi: 'यूट्यूब टाइटल', descEn: 'High-CTR YouTube titles tailored to your niche.', descHi: 'ज्यादा क्लिक लाने वाले आकर्षक यूट्यूब टाइटल।' },
  { id: 'youtube_shorts_script', cat: 'social', tier: 'pro', titleEn: 'YouTube Shorts Script', titleHi: 'यूट्यूब शॉर्ट्स स्क्रिप्ट', descEn: '45-second punchy vertical scripts built for retention.', descHi: 'रिटेंशन के लिए 45-सेकंड की तेज़ शॉर्ट्स स्क्रिप्ट।' },
  { id: 'reel_script', cat: 'social', tier: 'pro', titleEn: 'Reel Script Generator', titleHi: 'रील स्क्रिप्ट जनरेटर', descEn: '3-second hook, visual cues, voiceover, and closing CTA.', descHi: '3-सेकंड हुक, विजुअल संकेत और वॉइसओवर रील स्क्रिप्ट।' },
  { id: 'viral_hook', cat: 'social', tier: 'free', titleEn: 'Viral Hook Generator', titleHi: 'वायरल हुक जनरेटर', descEn: '10 attention-grabbing opening lines for Reels & Shorts.', descHi: 'रील्स और शॉर्ट्स के लिए 10 दमदार शुरुआती हुक।' },
  { id: 'hashtag_generator', cat: 'social', tier: 'free', titleEn: 'Hashtag Generator', titleHi: 'हैशटैग जनरेटर', descEn: 'Balanced mix of broad, niche, and discovery hashtags.', descHi: 'ब्रॉड, निश और डिस्कवरी हैशटैग का सही मिश्रण।' },
  { id: 'linkedin_post', cat: 'social', tier: 'pro', titleEn: 'LinkedIn Post Generator', titleHi: 'लिंक्डइन पोस्ट', descEn: 'Thought-leadership storytelling posts for professionals.', descHi: 'प्रोफेशनल्स के लिए प्रभावशाली लिंक्डइन पोस्ट।' },
  { id: 'twitter_post', cat: 'social', tier: 'free', titleEn: 'Twitter / X Post Generator', titleHi: 'X / ट्विटर पोस्ट', descEn: 'Crisp single posts and mini-threads under 280 chars.', descHi: '280 अक्षरों में सटीक X पोस्ट और थ्रेड आइडिया।' },

  // Marketing Tools (10)
  { id: 'ad_copy', cat: 'marketing', tier: 'pro', titleEn: 'Ad Copy Generator', titleHi: 'ऐड कॉपी जनरेटर', descEn: 'Primary text, headline, and CTA for Meta & Google Ads.', descHi: 'Meta और Google विज्ञापनों के लिए हाई-कन्वर्टिंग कॉपी।' },
  { id: 'product_description', cat: 'marketing', tier: 'free', titleEn: 'Product Description Generator', titleHi: 'प्रोडक्ट डिस्क्रिप्शन', descEn: 'Benefit-led e-commerce product listings & bullet specs.', descHi: 'फायदे और विशेषताओं के साथ ई-कॉमर्स प्रोडक्ट विवरण।' },
  { id: 'sales_copy', cat: 'marketing', tier: 'pro', titleEn: 'Sales Copy Generator', titleHi: 'सेल्स कॉपी जनरेटर', descEn: 'AIDA & PAS frameworks for offers and launches.', descHi: 'ऑफर और लॉन्च के लिए AIDA व PAS सेल्स कॉपी।' },
  { id: 'landing_page_copy', cat: 'marketing', tier: 'pro', titleEn: 'Landing Page Copy', titleHi: 'लैंडिंग पेज कॉपी', descEn: 'Hero headline, subcopy, benefits, social proof & FAQ blocks.', descHi: 'हीरो हेडिंग, लाभ, और CTA के साथ लैंडिंग पेज कॉपी।' },
  { id: 'business_name', cat: 'marketing', tier: 'free', titleEn: 'Business Name Generator', titleHi: 'बिज़नेस नाम जनरेटर', descEn: 'Memorable brand name ideas for Indian & global startups.', descHi: 'स्टार्टअप और ब्रांड के लिए यादगार नाम के आइडिया।' },
  { id: 'slogan_generator', cat: 'marketing', tier: 'free', titleEn: 'Slogan Generator', titleHi: 'स्लोगन / टैगलाइन', descEn: 'Punchy taglines that communicate your brand promise.', descHi: 'ब्रांड की पहचान बताने वाली दमदार टैगलाइन।' },
  { id: 'seo_meta_desc', cat: 'marketing', tier: 'free', titleEn: 'SEO Meta Description', titleHi: 'SEO मेटा डिस्क्रिप्शन', descEn: 'Click-worthy 155-character search snippets.', descHi: 'सर्च इंजन के लिए 155 अक्षरों का सटीक मेटा विवरण।' },
  { id: 'seo_keywords', cat: 'marketing', tier: 'pro', titleEn: 'SEO Keyword Idea Generator', titleHi: 'SEO कीवर्ड आइडिया', descEn: 'Long-tail, informational, and buyer-intent keyword clusters.', descHi: 'लॉन्ग-टेल और बायर-इंटेंट कीवर्ड समूह बनाएं।' },
  { id: 'marketing_email', cat: 'marketing', tier: 'pro', titleEn: 'Marketing Email Generator', titleHi: 'मार्केटिंग ईमेल', descEn: 'Launch announcements, newsletters, and nurture emails.', descHi: 'प्रोडक्ट लॉन्च और न्यूज़लेटर कैंपेन ईमेल लिखें।' },
  { id: 'cta_generator', cat: 'marketing', tier: 'free', titleEn: 'CTA Generator', titleHi: 'CTA जनरेटर', descEn: 'High-converting button & closing call-to-action lines.', descHi: 'क्लिक बढ़ाने वाले कॉल-टू-एक्शन वाक्य बनाएं।' },

  // AI Image Creator (6)
  { id: 'image_prompt', cat: 'image', tier: 'free', titleEn: 'AI Image Prompt Generator', titleHi: 'AI इमेज प्रॉम्प्ट', descEn: 'Detailed lighting, lens, style, and composition prompts.', descHi: 'लाइटिंग, कैमरा और स्टाइल के साथ सटीक इमेज प्रॉम्प्ट।' },
  { id: 'thumbnail_idea', cat: 'image', tier: 'pro', titleEn: 'Thumbnail Idea Generator', titleHi: 'थंबनेल आइडिया', descEn: 'YouTube thumbnail concepts, facial cues & 3-word text.', descHi: 'यूट्यूब थंबनेल लेआउट और आकर्षक टेक्स्ट आइडिया।' },
  { id: 'logo_prompt', cat: 'image', tier: 'free', titleEn: 'Logo Prompt Generator', titleHi: 'लोगो प्रॉम्प्ट', descEn: 'Minimalist, emblem, and SaaS vector logo art prompts.', descHi: 'मिनिमलिस्ट और वेक्टर लोगो डिज़ाइन प्रॉम्प्ट।' },
  { id: 'poster_prompt', cat: 'image', tier: 'free', titleEn: 'Poster Prompt Generator', titleHi: 'पोस्टर प्रॉम्प्ट', descEn: 'Event, festival, and promotional poster creative briefs.', descHi: 'इवेंट, त्योहार और प्रमोशनल पोस्टर के लिए प्रॉम्प्ट।' },
  { id: 'product_image_prompt', cat: 'image', tier: 'pro', titleEn: 'Product Image Prompt', titleHi: 'प्रोडक्ट फोटो प्रॉम्प्ट', descEn: 'Studio e-commerce packshot lighting & surface prompts.', descHi: 'ई-कॉमर्स स्टूडियो प्रोडक्ट फोटोग्राफी प्रॉम्प्ट।' },
  { id: 'social_image_prompt', cat: 'image', tier: 'free', titleEn: 'Social Media Image Prompt', titleHi: 'सोशल मीडिया इमेज प्रॉम्प्ट', descEn: 'Carousel slides, quote cards, and story visual prompts.', descHi: 'कैरोसेल स्लाइड और स्टोरी विजुअल के लिए प्रॉम्प्ट।' },

  // Video Creator (7)
  { id: 'video_script', cat: 'video', tier: 'pro', titleEn: 'Video Script Generator', titleHi: 'वीडियो स्क्रिप्ट जनरेटर', descEn: 'Full intro, sections, B-roll cues, and outro script.', descHi: 'इंट्रो, मुख्य भाग, B-roll और आउट्रो के साथ पूरी स्क्रिप्ट।' },
  { id: 'short_video_script', cat: 'video', tier: 'free', titleEn: 'Short Video Script', titleHi: 'शॉर्ट वीडियो स्क्रिप्ट', descEn: 'Fast-paced 30–60s scripts for vertical feeds.', descHi: '30–60 सेकंड के तेज़ शॉर्ट वीडियो के लिए स्क्रिप्ट।' },
  { id: 'youtube_outline', cat: 'video', tier: 'free', titleEn: 'YouTube Video Outline', titleHi: 'यूट्यूब वीडियो आउटलाइन', descEn: 'Chapter-by-chapter talking points and pacing plan.', descHi: 'चैप्टर के अनुसार वीडियो संरचना और पॉइंट्स।' },
  { id: 'reel_ideas', cat: 'video', tier: 'free', titleEn: 'Reel Ideas Generator', titleHi: 'रील आइडिया जनरेटर', descEn: 'Weekly Instagram Reel concepts tailored to your niche.', descHi: 'आपके निश के अनुसार साप्ताहिक रील आइडिया।' },
  { id: 'shorts_ideas', cat: 'video', tier: 'free', titleEn: 'Shorts Ideas Generator', titleHi: 'शॉर्ट्स आइडिया जनरेटर', descEn: 'Repeatable YouTube Shorts formats that grow subscribers.', descHi: 'सब्सक्राइबर बढ़ाने वाले यूट्यूब शॉर्ट्स आइडिया।' },
  { id: 'video_storyboard', cat: 'video', tier: 'pro', titleEn: 'Video Storyboard Generator', titleHi: 'वीडियो स्टोरीबोर्ड', descEn: 'Shot-by-shot framing, audio cues, and on-screen text.', descHi: 'शॉट-बाय-शॉट फ्रेमिंग, ऑडियो और स्क्रीन टेक्स्ट।' },
  { id: 'scene_description', cat: 'video', tier: 'free', titleEn: 'Scene Description Generator', titleHi: 'सीन डिस्क्रिप्शन', descEn: 'Visual atmosphere, camera movement, and mood notes.', descHi: 'कैमरा मूवमेंट, रोशनी और दृश्य का विस्तृत विवरण।' },

  // Business Creator (8)
  { id: 'invoice_text', cat: 'business', tier: 'free', titleEn: 'Invoice Text Generator', titleHi: 'इनवॉइस टेक्स्ट जनरेटर', descEn: 'Clean billing line items, GST note, and payment terms.', descHi: 'स्पष्ट बिलिंग आइटम, GST नोट और भुगतान शर्तें।' },
  { id: 'proposal_writer', cat: 'business', tier: 'pro', titleEn: 'Proposal Writer', titleHi: 'प्रपोज़ल राइटर', descEn: 'Client project proposals with scope, timeline, and pricing.', descHi: 'स्कोप, टाइमलाइन और प्राइसिंग के साथ क्लाइंट प्रपोज़ल।' },
  { id: 'business_plan', cat: 'business', tier: 'pro', titleEn: 'Business Plan Generator', titleHi: 'बिज़नेस प्लान जनरेटर', descEn: 'Lean executive summary, target market, and revenue outline.', descHi: 'कार्यकारी सारांश, लक्ष्य बाज़ार और रेवेन्यू प्लान।' },
  { id: 'resume_text', cat: 'business', tier: 'free', titleEn: 'Resume Builder Text', titleHi: 'रिज्यूमे टेक्स्ट बिल्डर', descEn: 'ATS-friendly summary, impact bullets, and skills section.', descHi: 'ATS-फ्रेंडली प्रोफाइल सारांश और उपलब्धियां लिखें।' },
  { id: 'cover_letter', cat: 'business', tier: 'free', titleEn: 'Cover Letter Writer', titleHi: 'कवर लेटर राइटर', descEn: 'Tailored job cover letters highlighting measurable impact.', descHi: 'नौकरी के लिए प्रभावी और सटीक कवर लेटर लिखें।' },
  { id: 'job_application', cat: 'business', tier: 'free', titleEn: 'Job Application Writer', titleHi: 'जॉब एप्लिकेशन राइटर', descEn: 'Crisp email/message applications for hiring managers.', descHi: 'भर्ती प्रबंधक के लिए संक्षिप्त जॉब आवेदन संदेश।' },
  { id: 'customer_reply', cat: 'business', tier: 'free', titleEn: 'Customer Reply Generator', titleHi: 'कस्टमर रिप्लाई', descEn: 'Polite, solution-focused support and review replies.', descHi: 'विनम्र और समाधान-केंद्रित ग्राहक सहायता उत्तर।' },
  { id: 'whatsapp_business', cat: 'business', tier: 'pro', titleEn: 'WhatsApp Business Message', titleHi: 'व्हाट्सऐप बिज़नेस संदेश', descEn: 'Order updates, catalog greetings, and follow-up templates.', descHi: 'ऑर्डर अपडेट, स्वागत और फॉलो-अप व्हाट्सऐप संदेश।' },

  // Productivity (8)
  { id: 'ai_brainstorming', cat: 'productivity', tier: 'free', titleEn: 'AI Brainstorming', titleHi: 'AI ब्रेनस्टॉर्मिंग', descEn: 'Generate fresh angles, formats, and campaign ideas fast.', descHi: 'किसी भी प्रोजेक्ट के लिए नए आइडिया और एंगल पाएं।' },
  { id: 'todo_generator', cat: 'productivity', tier: 'free', titleEn: 'To-Do Generator', titleHi: 'टू-डू लिस्ट जनरेटर', descEn: 'Break big goals into prioritized daily action steps.', descHi: 'बड़े लक्ष्यों को प्राथमिकता वाले दैनिक कार्यों में बांटें।' },
  { id: 'meeting_summary', cat: 'productivity', tier: 'pro', titleEn: 'Meeting Summary Generator', titleHi: 'मीटिंग सारांश', descEn: 'Decisions, owners, and next steps from raw meeting notes.', descHi: 'मीटिंग नोट्स से निर्णय और अगले कदम तैयार करें।' },
  { id: 'notes_generator', cat: 'productivity', tier: 'free', titleEn: 'Notes Generator', titleHi: 'नोट्स जनरेटर', descEn: 'Clean study and creator reference notes with key terms.', descHi: 'मुख्य शब्दों के साथ व्यवस्थित अध्ययन और क्रिएटर नोट्स।' },
  { id: 'presentation_outline', cat: 'productivity', tier: 'pro', titleEn: 'Presentation Outline', titleHi: 'प्रेजेंटेशन आउटलाइन', descEn: 'Slide-by-slide deck structure for pitches and workshops.', descHi: 'पिच और वर्कशॉप के लिए स्लाइड-दर-स्लाइड रूपरेखा।' },
  { id: 'faq_generator', cat: 'productivity', tier: 'free', titleEn: 'FAQ Generator', titleHi: 'FAQ जनरेटर', descEn: 'Clear customer questions and answers for pages & launches.', descHi: 'वेबसाइट और प्रोडक्ट लॉन्च के लिए स्पष्ट प्रश्नोत्तर।' },
  { id: 'checklist_generator', cat: 'productivity', tier: 'free', titleEn: 'Checklist Generator', titleHi: 'चेकलिस्ट जनरेटर', descEn: 'Pre-publish, shoot-day, and launch verification checklists.', descHi: 'शूटिंग, पब्लिश और लॉन्च के लिए पूरी चेकलिस्ट।' },
  { id: 'content_calendar', cat: 'productivity', tier: 'pro', titleEn: 'Content Calendar Generator', titleHi: 'कंटेंट कैलेंडर', descEn: '7-day multi-platform posting plan with topics & formats.', descHi: '7-दिन का मल्टी-प्लेटफॉर्म पोस्टिंग कंटेंट कैलेंडर।' }
];

export function getToolById(id) {
  return TOOLS.find((item) => item.id === id) || null;
}
