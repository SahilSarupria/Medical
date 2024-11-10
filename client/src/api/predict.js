export const predictImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
  
    const response = await fetch("/api/predict", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch prediction");
    }
  
    return await response.json();
  };
  