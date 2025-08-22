
import { GoogleGenAI, Type } from '@google/genai';
import type { ChatMessage, DietPlan, ReportSummary } from '../types';

if (!import.meta.env.VITE_API_KEY) {
    throw new Error("VITE_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const generateChatResponse = async (currentMessage: string, history: ChatMessage[]): Promise<string> => {
    const CARDIAC_KNOWLEDGE_BASE = `
Heart Disease Classifications and Subclasses
Summary:
• Research suggests there are around 10 main classifications of heart diseases, including coronary artery disease, arrhythmias, and heart failure, with some controversy over grouping, such as whether rheumatic heart disease is separate from valvular heart disease.
• Each classification has multiple subclasses, such as stable angina under coronary artery disease or atrial fibrillation under arrhythmias, with the total number varying by source but often in the dozens.
• The evidence leans toward no single standard classification, reflecting the complexity and ongoing debate in medical literature.
In summary, research suggests heart diseases are classified into approximately 10 main categories, with common ones including coronary artery disease, arrhythmias, heart failure, valvular heart disease, cardiomyopathy, congenital heart disease, pericardial disease, endocarditis, rheumatic heart disease, and hypertensive heart disease. Each has multiple sub-classes, such as stable angina under coronary artery disease or atrial fibrillation under arrhythmias, with the total number of sub-classes being extensive and varying by source. The evidence leans toward no single standard, reflecting the complexity and ongoing debate in medical classification.
Controversy and Variability
There is some controversy over how to group certain conditions. For instance, rheumatic heart disease is often considered a cause of valvular heart disease, leading some sources to merge them, while others list them separately. Similarly, hypertensive heart disease may be seen as a precursor to heart failure, complicating its classification. The AHA and other organizations sometimes focus on conditions like heart attack, which is a manifestation of coronary artery disease, rather than a separate type, adding to the variability
Heart diseases are grouped into major categories based on how they affect the heart, with each category having specific conditions or subclasses.

1. Coronary Artery Disease (CAD): Involves narrowed or blocked arteries supplying the heart.
Key Points
• Coronary Artery Disease (CAD) involves narrowed or blocked heart arteries, often due to plaque buildup, and can lead to various heart conditions.
• Stable Angina is chest pain during exertion, relieved by rest, and seems likely managed with lifestyle changes and medications.
• Unstable Angina is chest pain at rest, indicating higher risk, and research suggests it requires immediate medical attention.
• Myocardial Infarction, or heart attack, results from complete artery blockage, with evidence leaning toward urgent treatment to prevent muscle damage.
• Variant Angina, caused by artery spasms, typically occurs at rest and appears treatable with specific medications.
• Silent Ischemia is reduced blood flow without symptoms, and it seems likely it can lead to serious events if undetected.
Overview of CAD and Its Subclasses
Coronary Artery Disease (CAD) is a condition where the arteries supplying blood to the heart narrow or block, often due to plaque buildup, which can restrict oxygen delivery to the heart muscle. This can manifest in several ways, each with distinct characteristics and management approaches. Below, we explore the main subclasses: Stable Angina, Unstable Angina, Myocardial Infarction, Variant Angina, and Silent Ischemia, providing a clear understanding for those unfamiliar with these terms.
• Stable Angina: This is chest pain or discomfort that happens during physical activity or stress and goes away with rest or medication like nitroglycerin. It's a sign of chronic CAD and can be managed with lifestyle changes, such as quitting smoking and exercising, along with medications like aspirin and beta-blockers.
• Unstable Angina: This is more serious, with chest pain occurring at rest, suggesting a higher risk of heart attack. It requires immediate medical evaluation, often involving ECG tests and medications like aspirin and anticoagulants to prevent further complications.
• Myocardial Infarction: Known as a heart attack, it happens when an artery is completely blocked, causing heart muscle damage. It needs urgent treatment, such as emergency procedures to restore blood flow, to reduce the risk of death, which is notably high without prompt care.
• Variant Angina: This type involves chest pain from artery spasms, usually at rest, often at night or early morning. It's less common and can be treated with medications to prevent spasms, like calcium channel blockers.
• Silent Ischemia: This is when blood flow to the heart is reduced without any noticeable symptoms, making it hard to detect. It's concerning because it can lead to heart attacks without warning, and management focuses on preventing progression through lifestyle and medication.

2. Arrhythmias: Abnormal heart rhythms, too fast, slow, or irregular.
Key Points
• Arrhythmias are abnormal heart rhythms, which can be too fast, too slow, or irregular, and research suggests they vary from harmless to life-threatening.
• Atrial Fibrillation involves rapid, irregular atrial beats, increasing stroke risk, and it seems likely that management includes medications and procedures.
• Atrial Flutter is a rapid but organized atrial rhythm, and the evidence leans toward it being treated similarly to Atrial Fibrillation.
• Supraventricular Tachycardia is a fast heart rate above the ventricles, often managed with maneuvers or medications.
• Ventricular Tachycardia, a potentially fatal fast ventricular rate, may require defibrillators or drugs, depending on severity.
• Ventricular Fibrillation, a chaotic rhythm causing cardiac arrest, needs immediate CPR and defibrillation.
• Bradycardia, a slow heart rate (less than 60 beats per minute), might need a pacemaker if severe, and lifestyle changes can help prevention.
• Heart Block, with impaired electrical conduction, varies in severity, and pacemakers are often used for serious cases.
Detailed Examination of Subclasses
Atrial Fibrillation (AFib): A rapid and irregular atrial rhythm where the upper chambers (atria) beat chaotically. Heart rate can range from 100 to 175 bpm.
• Types: Occasional (Paroxysmal), Persistent, Long-standing Persistent, Permanent.
• Symptoms: Palpitations, chest pain, dizziness, fatigue, shortness of breath.
• Causes: Structural heart problems, high blood pressure, CAD, lung diseases, thyroid issues, viral infections, lifestyle triggers.
• Complications: Increased risk of blood clots and stroke.
• Treatment: Medications (beta-blockers, blood thinners), cardioversion, catheter ablation.
Atrial Flutter: A rapid but organized atrial rhythm (250-350 bpm). Less chaotic than AFib.
• Symptoms: Pounding in chest, chest pain, fainting, shortness of breath.
• Causes: Heart failure, COPD, pulmonary embolism, recent heart surgery.
• Complications: Risk of AFib, blood clots, stroke.
• Treatment: Similar to AFib (medications, cardioversion, ablation).
Supraventricular Tachycardia (SVT): Fast heart rate (150-220 bpm) originating above the ventricles.
• Symptoms: Very fast heartbeat, palpitations, chest pain, fainting, dizziness.
• Causes: Faulty signaling in the heart's upper chambers.
• Treatment: Vagal maneuvers, medications (beta-blockers), catheter ablation.
Ventricular Tachycardia (VT): Fast heart rate (>100 bpm) originating in the ventricles. Can be life-threatening.
• Symptoms: Chest pain, dizziness, palpitations, shortness of breath, fainting.
• Causes: Prior heart attack, structural heart disease, electrolyte imbalances.
• Treatment: Defibrillator (implanted or external), anti-arrhythmic drugs.
Ventricular Fibrillation (VFib): A chaotic and ineffective heart rhythm where ventricles quiver instead of contracting. Leads to cardiac arrest.
• Symptoms: Collapse, loss of consciousness.
• Causes: Problems in heart's electrical properties, disruption of blood supply.
• Treatment: Immediate CPR and defibrillation (AED).
Bradycardia: Slow heart rate (<60 bpm).
• Symptoms: Dizziness, fatigue, fainting, shortness of breath.
• Causes: Heart tissue damage from aging or heart disease, congenital defects, certain medications.
• Treatment: Pacemaker if severe.
Heart Block (AV block): Electrical signals from atria are slowed or blocked from reaching the ventricles.
• Types: First-degree (mild), Second-degree (some signals blocked), Third-degree (complete blockage).
• Symptoms: Can be asymptomatic; severe cases cause fainting, tiredness.
• Treatment: Pacemaker for second-degree (Type II) and third-degree.

3. Heart Failure: Heart can't pump enough blood.
Key Points
• Left-sided Heart Failure: Affects the left ventricle, causing fluid backup in the lungs (pulmonary edema). Symptoms include shortness of breath.
• Right-sided Heart Failure: Affects the right ventricle, causing fluid buildup in the body (peripheral edema). Symptoms include swollen legs.
• Systolic Heart Failure (HFrEF): The heart can't squeeze properly. Ejection fraction is reduced (<40%).
• Diastolic Heart Failure (HFpEF): The heart is stiff and can't fill properly. Ejection fraction is normal (≥50%).
• Acute Heart Failure: Sudden onset, often a medical emergency.
• Chronic Heart Failure: Develops over time, requires ongoing management.

4. Valvular Heart Disease: Problems with heart valves causing narrowing (stenosis) or leakage (regurgitation).
• Aortic Stenosis/Regurgitation: Affects the aortic valve, between the left ventricle and aorta.
• Mitral Stenosis/Regurgitation: Affects the mitral valve, between the left atrium and left ventricle.
• Tricuspid Stenosis/Regurgitation: Affects the tricuspid valve.
• Pulmonary Stenosis/Regurgitation: Affects the pulmonary valve.
• Symptoms: Shortness of breath, chest pain, fatigue, swelling.
• Treatment: Varies by severity; may include monitoring, medications, or valve repair/replacement surgery.

5. Cardiomyopathy: Diseases of the heart muscle affecting size and function.
• Dilated Cardiomyopathy: Heart chambers enlarge and weaken.
• Hypertrophic Cardiomyopathy: Heart muscle thickens, can block blood flow.
• Restrictive Cardiomyopathy: Heart muscle becomes stiff, restricting filling.
• Arrhythmogenic Right Ventricular Cardiomyopathy: Muscle in the right ventricle is replaced by fibrous tissue.
• Takotsubo Cardiomyopathy: Temporary weakening often triggered by stress ("broken heart syndrome").

6. Congenital Heart Disease: Heart defects present at birth.
• Atrial Septal Defect (ASD): A hole between the upper heart chambers (atria).
• Ventricular Septal Defect (VSD): A hole between the lower chambers (ventricles).
• Patent Ductus Arteriosus (PDA): A persistent connection between the aorta and pulmonary artery.
• Tetralogy of Fallot (TOF): A combination of four defects causing low oxygen levels.
• Transposition of the Great Arteries (TGA): Main arteries are switched.
• Coarctation of the Aorta: Narrowing of the aorta.

7. Pericardial Disease: Affects the sac around the heart (pericardium).
• Acute Pericarditis: Inflammation of the pericardium, causing sharp chest pain.
• Pericardial Effusion: Fluid buildup around the heart.
• Cardiac Tamponade: An emergency where excessive fluid compresses the heart.
• Constrictive Pericarditis: The sac becomes scarred and stiff, restricting heart movement.

8. Endocarditis: Infection of the heart's inner lining, especially valves.
• Infective Endocarditis: Caused by bacteria or fungi entering the bloodstream.
• Non-infective Endocarditis: Sterile condition linked to autoimmune diseases or cancer.

9. Rheumatic Heart Disease: Valve damage from rheumatic fever, a complication of untreated strep throat. Primarily affects the mitral valve.

10. Hypertensive Heart Disease: Heart issues from long-term high blood pressure.
• Left Ventricular Hypertrophy (LVH): Thickening of the left ventricle wall.
• Can lead to Heart Failure and accelerate Coronary Artery Disease.
`;

    const model = 'gemini-2.5-flash';
    
    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: currentMessage }] });

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: `You are a specialized Cardiac AI Assistant. Your knowledge is strictly limited to the provided text: "${CARDIAC_KNOWLEDGE_BASE}".
        - Answer user questions based ONLY on the provided text.
        - If the answer is not in the text, clearly state that the information is not available in your knowledge base and you cannot answer. Do not use external knowledge.
        - Format your answers clearly using Markdown, including headings, lists, and bold text for better readability.
        - Do not provide medical advice. Include a disclaimer that the user should consult a healthcare professional for any medical concerns.`,
      },
    });

    return response.text;
};

const generateDietPlan = async (formData: any): Promise<DietPlan> => {
    const prompt = `Generate a personalized 7-day heart-healthy INDIAN diet plan for a ${formData.age}-year-old ${formData.gender}, weighing ${formData.weight} kg and ${formData.height} cm tall, with a ${formData.activityLevel} activity level. The patient has ${formData.cardiacCondition}. Dietary preferences: ${formData.preferences || 'None'}. Provide a detailed plan for breakfast, lunch, dinner, and two snacks for each day. Include calorie counts for each meal and a total for each day.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            Monday: {
                type: Type.OBJECT,
                properties: {
                    meals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, calories: { type: Type.NUMBER } }
                        }
                    },
                    dailyCalories: { type: Type.NUMBER }
                }
            },
            Tuesday: {
                type: Type.OBJECT,
                properties: {
                    meals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, calories: { type: Type.NUMBER } }
                        }
                    },
                    dailyCalories: { type: Type.NUMBER }
                }
            },
            Wednesday: {
                type: Type.OBJECT,
                properties: {
                    meals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, calories: { type: Type.NUMBER } }
                        }
                    },
                    dailyCalories: { type: Type.NUMBER }
                }
            },
            Thursday: {
                type: Type.OBJECT,
                properties: {
                    meals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, calories: { type: Type.NUMBER } }
                        }
                    },
                    dailyCalories: { type: Type.NUMBER }
                }
            },
            Friday: {
                type: Type.OBJECT,
                properties: {
                    meals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, calories: { type: Type.NUMBER } }
                        }
                    },
                    dailyCalories: { type: Type.NUMBER }
                }
            },
            Saturday: {
                type: Type.OBJECT,
                properties: {
                    meals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, calories: { type: Type.NUMBER } }
                        }
                    },
                    dailyCalories: { type: Type.NUMBER }
                }
            },
            Sunday: {
                type: Type.OBJECT,
                properties: {
                    meals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, calories: { type: Type.NUMBER } }
                        }
                    },
                    dailyCalories: { type: Type.NUMBER }
                }
            }
        }
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema,
        }
    });
    
    return JSON.parse(response.text);
};


const analyzeECG = async (base64Image: string, mimeType: string): Promise<string> => {
    const prompt = "Analyze the provided ECG image. Identify key features such as heart rate, rhythm, axis, intervals (PR, QRS, QT), and any notable abnormalities like arrhythmias, ischemia, or hypertrophy. Provide a preliminary analysis. This is not a medical diagnosis.";
    
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType,
        },
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }, imagePart] },
    });
    
    return response.text;
};

const summarizeReport = async (text: string): Promise<ReportSummary> => {
    const prompt = `Analyze the following medical text. Provide a JSON object with three keys: 
1. "summary": A concise summary of the main points.
2. "medicalTerms": An array of key medical terms found in the text, where each item is an object with "term" and "definition".
3. "explanation": A simple, plain-language explanation of what the report means.`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            medicalTerms: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        term: { type: Type.STRING },
                        definition: { type: Type.STRING }
                    }
                }
            },
            explanation: { type: Type.STRING }
        }
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${prompt}\n\nText to analyze:\n${text}`,
        config: {
            responseMimeType: 'application/json',
            responseSchema,
        }
    });

    return JSON.parse(response.text);
};

const summarizeReportFromFile = async (base64Data: string, mimeType: string): Promise<ReportSummary> => {
    const prompt = `Analyze the following medical report from the file. Provide a JSON object with three keys: 
1. "summary": A concise summary of the main points.
2. "medicalTerms": An array of key medical terms found in the text, where each item is an object with "term" and "definition".
3. "explanation": A simple, plain-language explanation of what the report means.`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            medicalTerms: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        term: { type: Type.STRING },
                        definition: { type: Type.STRING }
                    }
                }
            },
            explanation: { type: Type.STRING }
        }
    };

    const filePart = {
        inlineData: {
            data: base64Data,
            mimeType,
        },
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }, filePart] },
        config: {
            responseMimeType: 'application/json',
            responseSchema,
        }
    });

    return JSON.parse(response.text);
};


export const geminiService = {
  generateChatResponse,
  generateDietPlan,
  analyzeECG,
  summarizeReport,
  summarizeReportFromFile,
};
