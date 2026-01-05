import katex from "katex";

function renderLatex(content: string): string {
  return content.replace(/\[latex\](.*?)\[\/latex\]/gs, (_, expr) => {
    try {
      return katex.renderToString(expr, {
        throwOnError: false,
        displayMode: false, // inline mode
      });
    } catch (err) {
      console.error("KaTeX render error:", err);
      return expr; // fallback: just return plain text
    }
  });
}
