# Real Loading Progress Implementation Guide

## Overview

The application now supports **REAL progress tracking** based on actual resource loading, not simulated progress.

## How It Works

### 1. Task-Based Progress Tracking

- Each async operation registers as a task
- Progress is calculated based on completed tasks
- Overall progress = average of all task progress

### 2. Components

#### useLoading Hook (Updated)

```javascript
const {
  isLoading, // Boolean: is loading active
  progress, // Number: 0-100 overall progress
  withLoading, // Function: single operation with progress
  withMultipleLoading, // Function: parallel operations with progress
  registerTask, // Function: register a new task
  updateTaskProgress, // Function: update task progress
  completeTask, // Function: mark task complete
  preloadImages, // Function: preload images with progress
} = useLoading();
```

## Usage Examples

### Example 1: Single Operation with Progress

```javascript
import { useLoading } from "../hooks/useLoading";

const MyComponent = () => {
  const { withLoading } = useLoading();

  const loadData = async () => {
    await withLoading(
      async (onProgress) => {
        onProgress(10); // Started
        const data = await fetchDataFromAPI();
        onProgress(50); // Half done
        const processed = await processData(data);
        onProgress(100); // Complete
        return processed;
      },
      { taskId: "data-load", minLoadingTime: 500 }
    );
  };

  return <button onClick={loadData}>Load Data</button>;
};
```

### Example 2: Multiple Parallel Operations

```javascript
import { useLoading } from "../hooks/useLoading";

const HomePage = () => {
  const { withMultipleLoading } = useLoading();

  const loadPageData = async () => {
    const results = await withMultipleLoading([
      {
        taskId: "products",
        fn: async (onProgress) => {
          onProgress(0);
          const products = await getAllProducts();
          onProgress(100);
          return products;
        },
      },
      {
        taskId: "services",
        fn: async (onProgress) => {
          onProgress(0);
          const services = await getAllServices();
          onProgress(100);
          return services;
        },
      },
      {
        taskId: "images",
        fn: async (onProgress) => {
          await preloadImagesWithProgress(imageUrls, onProgress);
          return true;
        },
      },
    ]);

    return results;
  };

  return <div>Homepage</div>;
};
```

### Example 3: Image Preloading

```javascript
import { useLoading } from "../hooks/useLoading";

const ImageGallery = () => {
  const { preloadImages, registerTask, updateTaskProgress, completeTask } =
    useLoading();

  const loadGallery = async () => {
    const imageUrls = [
      "/images/photo1.jpg",
      "/images/photo2.jpg",
      "/images/photo3.jpg",
    ];

    registerTask("gallery-images");

    const results = await preloadImages(imageUrls);

    // preloadImages automatically updates progress
    // No need to manually call updateTaskProgress

    completeTask("gallery-images");
    return results;
  };

  return <button onClick={loadGallery}>Load Gallery</button>;
};
```

### Example 4: Firebase Query with Progress

```javascript
import { trackFirebaseQuery } from "../utils/loadingHelpers";
import { useLoading } from "../hooks/useLoading";

const DataComponent = () => {
  const { withLoading } = useLoading();

  const loadFirebaseData = async () => {
    await withLoading(async (onProgress) => {
      const query = getDocs(collection(db, "products"));
      const data = await trackFirebaseQuery(query, onProgress);
      return data;
    });
  };

  return <div>Data</div>;
};
```

### Example 5: Chunked Data Processing

```javascript
import { processInChunks } from "../utils/loadingHelpers";
import { useLoading } from "../hooks/useLoading";

const BulkProcessor = () => {
  const { withLoading } = useLoading();

  const processBulkData = async (items) => {
    await withLoading(async (onProgress) => {
      const results = await processInChunks(
        items,
        async (item) => {
          // Process each item
          return await processItem(item);
        },
        onProgress, // Automatically updates as chunks complete
        10 // Chunk size
      );
      return results;
    });
  };

  return <button onClick={() => processBulkData(largeArray)}>Process</button>;
};
```

## Helper Functions

### trackFirebaseQuery(queryPromise, onProgress)

Tracks a Firebase query with progress updates

```javascript
const data = await trackFirebaseQuery(
  getDocs(collection(db, "users")),
  (progress) => console.log(`Loading: ${progress}%`)
);
```

### trackMultipleQueries(queries, onProgress)

Tracks multiple Firebase queries

```javascript
const results = await trackMultipleQueries(
  [
    { name: "users", promise: getDocs(collection(db, "users")) },
    { name: "posts", promise: getDocs(collection(db, "posts")) },
  ],
  (progress) => console.log(`Overall: ${progress}%`)
);
```

### processInChunks(items, processFn, onProgress, chunkSize)

Process large arrays in chunks with progress

```javascript
await processInChunks(
  largeArray,
  async (item) => await processItem(item),
  (progress) => console.log(`Progress: ${progress}%`),
  10 // Process 10 items at a time
);
```

### preloadImagesWithProgress(imageUrls, onProgress)

Preload images with real progress tracking

```javascript
await preloadImagesWithProgress(["/img1.jpg", "/img2.jpg"], (progress) =>
  console.log(`Images: ${progress}%`)
);
```

### createProgressTracker()

Create a custom progress tracker

```javascript
const tracker = createProgressTracker();

tracker.registerTask("task1", 1);
tracker.registerTask("task2", 2); // weight = 2 (more important)

tracker.onProgress((progress) => {
  console.log(`Overall progress: ${progress}%`);
});

tracker.updateTask("task1", 50);
tracker.completeTask("task2");
```

## Migration from Old Simulated Loading

### Before (Simulated)

```javascript
const loadData = async () => {
  const { withLoading } = useLoading();

  await withLoading(async () => {
    const data = await fetchData();
    return data;
  });
};
```

### After (Real Progress)

```javascript
const loadData = async () => {
  const { withLoading } = useLoading();

  await withLoading(
    async (onProgress) => {
      onProgress(10); // Started
      const data = await fetchData();
      onProgress(50); // Fetched
      const processed = processData(data);
      onProgress(100); // Done
      return processed;
    },
    { taskId: "data-load" }
  );
};
```

## Best Practices

1. **Always call onProgress** at key points in your async function
2. **Start with low percentage** (10-20%) to show immediate feedback
3. **End with 100%** when operation completes
4. **Use taskId** for debugging and tracking
5. **Preload images** that are critical for user experience
6. **Track multiple operations** in parallel for accurate overall progress

## Benefits of Real Loading

✅ **Accurate Progress**: Shows actual completion status
✅ **Better UX**: Users know exactly what's happening
✅ **Debugging**: Can identify slow operations
✅ **Professional**: Industry-standard loading experience
✅ **Flexible**: Works with any async operation

## Performance Tips

- Only track important operations (not every tiny task)
- Use chunked processing for large datasets
- Preload only visible/critical images
- Set reasonable minLoadingTime to prevent flashing
