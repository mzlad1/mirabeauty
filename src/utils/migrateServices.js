// Migration script to move sample services to Firestore
import { addService } from "../services/servicesService";
import { sampleServices } from "../data/sampleServices";

export const migrateServices = async () => {
  try {
    console.log("Starting services migration...");

    const migrationPromises = sampleServices.map(async (service) => {
      try {
        // Remove the id from the service data since Firestore will generate it
        const { id, ...serviceData } = service;

        // Add additional fields for better Firebase compatibility
        const enhancedService = {
          ...serviceData,
          available: true,
          rating: service.rating || 4.8,
          reviewsCount: service.reviewsCount || 25,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await addService(enhancedService);
        console.log(`Migrated service: ${service.name} with ID: ${result.id}`);
        return result;
      } catch (error) {
        console.error(`Error migrating service ${service.name}:`, error);
        throw error;
      }
    });

    const results = await Promise.all(migrationPromises);
    console.log(
      `Successfully migrated ${results.length} services to Firestore`
    );

    return {
      success: true,
      message: `تم ترحيل ${results.length} خدمة بنجاح إلى قاعدة البيانات`,
      migratedServices: results,
    };
  } catch (error) {
    console.error("Services migration failed:", error);
    return {
      success: false,
      message: "فشل في ترحيل الخدمات: " + error.message,
      error,
    };
  }
};
