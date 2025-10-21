// Migration script to move sample FAQs to Firestore
import { addFAQ } from "../services/faqService";
import { sampleFAQs } from "../data/sampleFAQs";

export const migrateFAQs = async () => {
  try {
    console.log("Starting FAQs migration...");

    const migrationPromises = sampleFAQs.map(async (faq) => {
      try {
        // Remove the id from the FAQ data since Firestore will generate it
        const { id, ...faqData } = faq;

        // Add the original ID as faqId for reference
        const enhancedFAQ = {
          ...faqData,
          faqId: id, // Keep original ID for reference
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await addFAQ(enhancedFAQ);
        console.log(
          `Migrated FAQ: ${faq.question.substring(0, 50)}... with ID: ${
            result.id
          }`
        );
        return result;
      } catch (error) {
        console.error(
          `Error migrating FAQ ${faq.question.substring(0, 50)}...:`,
          error
        );
        throw error;
      }
    });

    const results = await Promise.all(migrationPromises);
    console.log(`Successfully migrated ${results.length} FAQs to Firestore`);

    return {
      success: true,
      message: `تم ترحيل ${results.length} سؤال شائع بنجاح إلى قاعدة البيانات`,
      migratedFAQs: results,
    };
  } catch (error) {
    console.error("FAQs migration failed:", error);
    return {
      success: false,
      message: "فشل في ترحيل الأسئلة الشائعة: " + error.message,
      error,
    };
  }
};
