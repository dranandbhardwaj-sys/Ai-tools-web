export function generateTemplateOutput({ tool, topic, context, tone, outLang, length }) {
  const cleanTopic = topic.trim();
  const audience = context.trim() || (outLang === 'hi' ? 'डिजिटल क्रिएटर्स और पाठक' : 'creators, students, and small businesses');
  const isHi = outLang === 'hi';
  const isBi = outLang === 'bilingual';

  const toneTag = {
    professional: isHi ? 'प्रोफेशनल और स्पष्ट' : 'Professional & Structured',
    engaging: isHi ? 'रोचक और हाई-एंगेजमेंट' : 'Engaging & Viral-Ready',
    persuasive: isHi ? 'प्रभावशाली और सेल्स-केंद्रित' : 'Persuasive & Conversion-Focused',
    casual: isHi ? 'सरल और मित्रवत' : 'Friendly & Conversational',
    storytelling: isHi ? 'कहानी-आधारित' : 'Narrative & Storytelling'
  }[tone] || 'Engaging';

  const detailDepth = length === 'short' ? 1 : length === 'long' ? 3 : 2;
  const cat = tool.cat;
  const id = tool.id;

  const lines = [];

  if (cat === 'writing') {
    if (id === 'text_summarizer') {
      const sentences = cleanTopic.split(/(?<=[.!?।])\s+/).filter(Boolean);
      const picks = sentences.slice(0, Math.min(sentences.length, detailDepth + 2));
      lines.push(isHi ? `📌 संक्षिप्त सारांश (${toneTag})` : `📌 Executive Summary (${toneTag})`);
      lines.push('');
      picks.forEach((p, idx) => lines.push(`${idx + 1}. ${p}`));
      if (picks.length <= 1) {
        lines.push(`• Key Insight: ${cleanTopic.slice(0, 140)}${cleanTopic.length > 140 ? '...' : ''}`);
        lines.push(`• Target Takeaway for ${audience}: Focus on clarity and immediate execution.`);
      }
    } else if (id === 'grammar_checker' || id === 'rewrite_text') {
      const normalized = cleanTopic.replace(/\s+/g, ' ').replace(/\bi\b/g, 'I').trim();
      lines.push(isHi ? `✨ परिष्कृत संस्करण (${toneTag}):` : `✨ Polished Version (${toneTag}):`);
      lines.push('');
      lines.push(normalized.charAt(0).toUpperCase() + normalized.slice(1) + (/[.!?।]$/.test(normalized) ? '' : '.'));
      lines.push('');
      lines.push(isHi ? 'सुझाव:' : 'Editorial Notes:');
      lines.push(isHi ? `• वाक्य प्रवाह को ${audience} के लिए अधिक स्पष्ट बनाया गया है।` : `• Tightened phrasing and cadence for ${audience}.`);
      lines.push(isHi ? '• अनावश्यक स्पेस हटाकर पठनीयता बढ़ाई गई है।' : '• Removed spacing artifacts and improved scannability.');
    } else if (id === 'hindi_to_english' || id === 'english_to_hindi' || id === 'text_translator') {
      lines.push(`🌐 Bilingual Creator Adaptation (${toneTag})`);
      lines.push('');
      lines.push(`English Draft:\n"${cleanTopic}" — Crafted cleanly for ${audience} with a clear headline, relatable value, and direct call to action.`);
      lines.push('');
      lines.push(`हिन्दी रूपांतरण:\n"${cleanTopic}" — ${audience} के लिए सरल, स्वाभाविक और आकर्षक हिन्दी प्रस्तुति।`);
    } else {
      lines.push(isHi ? `# ${cleanTopic} — संपूर्ण ड्राफ्ट (${toneTag})` : `# ${cleanTopic} — Complete Draft (${toneTag})`);
      lines.push('');
      lines.push(isHi
        ? `प्रस्तावना:\nआज ${audience} के बीच "${cleanTopic}" तेजी से महत्वपूर्ण विषय बन रहा है। सही रणनीति के साथ आप कम समय में बेहतर परिणाम पा सकते हैं।`
        : `Introduction:\n"${cleanTopic}" is quickly becoming essential for ${audience}. With a clear, repeatable workflow, you can turn ideas into publish-ready results faster.`);
      lines.push('');
      lines.push(isHi ? 'मुख्य बिंदु:' : 'Key Sections:');
      lines.push(isHi ? `1. स्पष्ट उद्देश्य: सबसे पहले तय करें कि ${audience} को क्या मूल्य चाहिए।` : `1. Clear Positioning: Define the exact outcome ${audience} want first.`);
      lines.push(isHi ? '2. व्यावहारिक कदम: छोटे, नियमित और मापने योग्य कदम अपनाएं।' : '2. Actionable Execution: Break the process into practical, repeatable steps.');
      if (detailDepth >= 2) {
        lines.push(isHi ? '3. उदाहरण और भरोसा: वास्तविक उदाहरणों से अपनी बात को प्रभावी बनाएं।' : '3. Proof & Examples: Back every claim with a concrete real-world example.');
      }
      if (detailDepth >= 3) {
        lines.push(isHi ? '4. निरंतर सुधार: फीडबैक देखकर अगले संस्करण को बेहतर बनाएं।' : '4. Iteration Loop: Review reader feedback and refine your next edition.');
      }
      lines.push('');
      lines.push(isHi ? 'निष्कर्ष:\nआज ही पहला कदम उठाएं और इस रूपरेखा को अपनी शैली के अनुसार लागू करें।' : 'Conclusion:\nStart with one focused step today and customize this draft with your own voice.');
    }
  } else if (cat === 'social') {
    if (id === 'hashtag_generator') {
      const slug = cleanTopic.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 3).join('');
      const base = slug || 'aicreator';
      lines.push(`#${base} #CreatorEconomy #ContentCreation #DigitalIndia #GrowthTips`);
      lines.push(`#${base}Tips #ReelsIndia #YouTubeCreator #ContentStrategy #DailyCreator`);
      if (detailDepth >= 2) {
        lines.push(`#SmallBusinessIndia #CreatorToolkit #LearnAndGrow #ViralContent #SocialMediaMarketing`);
      }
    } else if (id === 'reel_script' || id === 'youtube_shorts_script' || id === 'viral_hook') {
      lines.push(isHi ? `🎬 ${tool.titleHi}: ${cleanTopic}` : `🎬 ${tool.titleEn}: ${cleanTopic}`);
      lines.push('');
      lines.push(isHi ? '🔥 हुक (0–3 सेकंड):' : '🔥 Hook (0–3s):');
      lines.push(isHi
        ? `"अगर आप ${audience} हैं और ${cleanTopic} में समय बचाना चाहते हैं, तो यह 30 सेकंड का तरीका देखें!"`
        : `"Stop scrolling if you're among ${audience} trying to master ${cleanTopic}!"`);
      lines.push('');
      lines.push(isHi ? '🎯 मुख्य स्क्रिप्ट (3–25 सेकंड):' : '🎯 Core Script (3–25s):');
      lines.push(isHi
        ? `• सीन 1: समस्या दिखाएं — ज्यादातर लोग यहाँ गलती करते हैं।\n• सीन 2: 3-स्टेप समाधान साझा करें जो तुरंत काम करे।\n• सीन 3: नतीजा स्क्रीन पर टेक्स्ट के साथ दिखाएं।`
        : `• Beat 1: Call out the common mistake around ${cleanTopic}.\n• Beat 2: Demonstrate the 3-step shortcut clearly on screen.\n• Beat 3: Show the before/after transformation.`);
      lines.push('');
      lines.push(isHi ? '📣 CTA (अंतिम 5 सेकंड):' : '📣 Closing CTA (Last 5s):');
      lines.push(isHi ? '"इस रील को सेव करें और ऐसे ही टूल्स के लिए फॉलो करें!"' : '"Save this post to try later and follow for daily creator workflows!"');
    } else {
      lines.push(isHi ? `📱 ${tool.titleHi} — ${cleanTopic}` : `📱 ${tool.titleEn} — ${cleanTopic}`);
      lines.push('');
      lines.push(isHi
        ? `क्या आप जानते हैं? ${cleanTopic} आपके काम को 2x तेज़ बना सकता है ✨\n\nविशेष रूप से ${audience} के लिए तैयार 3 मुख्य बातें:\n✅ स्पष्ट शुरुआत करें\n✅ लगातार अभ्यास करें\n✅ सही टूल चुनें\n\nआपकी राय कमेंट में बताएं 👇`
        : `Here is a fresh look at ${cleanTopic} built for ${audience} ✨\n\n3 takeaways you can apply today:\n✅ Start with one clear hook\n✅ Keep your message easy to scan\n✅ End with an unmistakable next step\n\nWhich point are you trying first? Drop it below 👇`);
    }
  } else if (cat === 'marketing') {
    lines.push(isHi ? `📣 ${tool.titleHi}: ${cleanTopic} (${toneTag})` : `📣 ${tool.titleEn}: ${cleanTopic} (${toneTag})`);
    lines.push('');
    lines.push(isHi ? `हेडलाइन:\n"${cleanTopic} — ${audience} के लिए स्मार्ट समाधान"` : `Headline:\n"${cleanTopic} — Built for ${audience}"`);
    lines.push('');
    lines.push(isHi ? 'मुख्य वैल्यू प्रपोज़िशन:' : 'Primary Copy:');
    lines.push(isHi
      ? `समय बचाएं, गुणवत्ता बढ़ाएं और बिना उलझन के ${cleanTopic} के साथ बेहतर परिणाम पाएं।`
      : `Save hours every week and unlock consistent results with ${cleanTopic} — engineered specifically for ${audience}.`);
    lines.push('');
    lines.push(isHi ? 'प्रमुख लाभ:' : 'Conversion Bullets:');
    lines.push(isHi ? '• मिनटों में शुरू करें\n• मोबाइल और डेस्कटॉप पर सहज अनुभव\n• मापने योग्य ग्रोथ और स्पष्ट ROI' : '• Fast setup in minutes\n• Mobile-first, reliable workflow\n• Built for measurable growth & ROI');
    lines.push('');
    lines.push(isHi ? 'कॉल-टू-एक्शन (CTA):\n👉 अभी शुरू करें • फ्री डेमो देखें' : 'Call to Action:\n👉 Get Started Today • Try Now');
  } else if (cat === 'image') {
    lines.push(`🎨 ${tool.titleEn} — Prompt Pack for "${cleanTopic}"`);
    lines.push('');
    lines.push(`Primary Prompt:\nUltra-detailed editorial composition of ${cleanTopic}, designed for ${audience}, dramatic rim lighting, crisp focal depth, rich indigo and electric blue color grading, 85mm lens, clean modern aesthetic, high contrast, 4K studio render.`);
    lines.push('');
    lines.push(`Variation (Minimalist SaaS / Creator Card):\nMinimal isometric visual of ${cleanTopic}, soft glassmorphic highlights, clean studio backdrop, sharp vector-inspired lighting, balanced negative space for headline typography.`);
    if (detailDepth >= 2) {
      lines.push('');
      lines.push('Negative Prompt:\nblurry text, watermark, distorted hands, cluttered background, low resolution, washed-out colors.');
    }
  } else if (cat === 'video') {
    lines.push(isHi ? `🎥 ${tool.titleHi}: ${cleanTopic}` : `🎥 ${tool.titleEn}: ${cleanTopic}`);
    lines.push('');
    lines.push(isHi ? 'शॉट 1 (0:00–0:08) — ओपनिंग हुक:' : 'Scene 1 (0:00–0:08) — Cold Open:');
    lines.push(isHi ? `क्लोज-अप शॉट + बोल्ड टेक्स्ट ओवरले: "${cleanTopic}"` : `Tight close-up + bold kinetic title: "${cleanTopic}"`);
    lines.push('');
    lines.push(isHi ? 'शॉट 2 (0:08–0:35) — मुख्य प्रदर्शन:' : 'Scene 2 (0:08–0:35) — Step-by-Step Breakdown:');
    lines.push(isHi ? `${audience} के लिए स्क्रीन डेमो और मुख्य बिंदुओं का B-roll।` : `Screen recording / B-roll demonstrating the core workflow for ${audience}.`);
    lines.push('');
    lines.push(isHi ? 'शॉट 3 (0:35–0:50) — परिणाम और आउट्रो:' : 'Scene 3 (0:35–0:50) — Outcome & Outro:');
    lines.push(isHi ? 'फाइनल रिज़ल्ट दिखाएं और सब्सक्राइब/सेव का स्पष्ट CTA दें।' : 'Show final result side-by-side and deliver your closing subscribe/save CTA.');
  } else if (cat === 'business') {
    lines.push(isHi ? `💼 ${tool.titleHi} — ${cleanTopic}` : `💼 ${tool.titleEn} — ${cleanTopic}`);
    lines.push('');
    lines.push(isHi
      ? `विषय: ${cleanTopic}\nतैयारकर्ता: क्रिएटर / बिज़नेस टीम\nलक्षित प्राप्तकर्ता: ${audience}`
      : `Subject: ${cleanTopic}\nPrepared for: ${audience}`);
    lines.push('');
    lines.push(isHi ? 'विवरण और शर्तें:' : 'Structured Details:');
    lines.push(isHi
      ? `1. कार्यक्षेत्र (Scope): ${cleanTopic} की स्पष्ट डिलीवरी और समयसीमा।\n2. समय और गुणवत्ता: निर्धारित माइलस्टोन के अनुसार पारदर्शी अपडेट।\n3. अगला कदम: स्वीकृति मिलते ही कार्य प्रारंभ।`
      : `1. Scope & Deliverable: Clear execution plan for ${cleanTopic}.\n2. Timeline & Milestones: Transparent weekly updates and review checkpoints.\n3. Next Step: Reply to confirm scope and schedule kickoff.`);
  } else {
    lines.push(isHi ? `⚡ ${tool.titleHi} — ${cleanTopic}` : `⚡ ${tool.titleEn} — ${cleanTopic}`);
    lines.push('');
    lines.push(isHi ? 'प्राथमिकता कार्य सूची:' : 'Prioritized Action Plan:');
    lines.push(isHi ? `• [ ] लक्ष्य तय करें: ${cleanTopic} के लिए मुख्य परिणाम लिखें` : `• [ ] Define Goal: Lock the target outcome for ${cleanTopic}`);
    lines.push(isHi ? `• [ ] प्रारूप तैयार करें: ${audience} के अनुसार ड्राफ्ट बनाएं` : `• [ ] Draft & Structure: Tailor key points for ${audience}`);
    lines.push(isHi ? '• [ ] समीक्षा और सुधार: क्लैरिटी और CTA जांचें' : '• [ ] Review & Polish: Check clarity, tone, and CTA');
    if (detailDepth >= 2) {
      lines.push(isHi ? '• [ ] पब्लिश और ट्रैक करें: पब्लिश के बाद एंगेजमेंट देखें' : '• [ ] Publish & Measure: Track performance after publishing');
    }
  }

  if (isBi && !lines.some((l) => l.includes('हिन्दी'))) {
    lines.push('');
    lines.push('---');
    lines.push(`🇮🇳 हिन्दी सारांश (${tool.titleHi}): "${cleanTopic}" को ${audience} के लिए ${toneTag} अंदाज़ में प्रस्तुत किया गया है।`);
  }

  return lines.join('\n');
}
