export function copy(){
    let copy = window.addEventListener("copy", async function () {
        try {
          let selectedText = window.getSelection().toString();
          if (!selectedText) return;
            await navigator.clipboard.writeText("");
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    });
}
