window.addEventListener("load", () => {
  // ================= URL PARAMETERS =================
  const params = new URLSearchParams(
    window.location.search
  );
  const service =
    params.get("service") || "";
  const price =
    params.get("price") || "";
  const features =
    params.get("features") || "";
  const type =
    params.get("type") || "";
  const pages =
    params.get("pages") || "";
  const complexity =
    params.get("complexity") || "";
  const autoClient =
    params.get("autoclient");
  // Stop if not coming from services page
  if(!autoClient) return;
  // Wait for everything to render
  setTimeout(() => {
    // ================= ELEMENTS =================
    const projectType =
      document.getElementById("projectType");
    const budgetSlider =
      document.getElementById("budgetRange");
    const budgetValue =
      document.getElementById("budgetValue");
    const messageBox =
      document.getElementById("message");
    // ================= PROJECT TYPE =================
    if(projectType){
      // Loop through all options
      for(let option of projectType.options){
        // Match service exactly
        if(
          option.value.trim() ===
          service.trim()
        ){
          option.selected = true;
          projectType.value =
            option.value;
          break;
        }
      }
      // Trigger change event
      projectType.dispatchEvent(
        new Event("change")
      );
    }
    // ================= PRICE =================
    if(budgetSlider){
      budgetSlider.value = price;
      // Trigger slider update
      budgetSlider.dispatchEvent(
        new Event("input")
      );
    }
    // ================= PRICE TEXT =================
    if(budgetValue){
      budgetValue.innerText =
        `${price}`;
    }
    // ================= MESSAGE =================
    let details = `
Type: ${type}
Complexity: ${complexity}
`;
    // Add pages only for websites
    if(service === "Web Solutions"){
      details += `
Number of Pages: ${pages}
`;
    }
    // Add features
    details += `
Extra Features:
${features || "None"}
`;
    // ================= TEXTAREA =================
    if(messageBox){
      messageBox.value =
        details.trim();
    }
  }, 500);
});