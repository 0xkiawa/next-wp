'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import katex from "katex";
// IMPORTANT: Import KaTeX CSS globally in app/layout.tsx or pages/_app.tsx
// import "katex/dist/katex.min.css";  <-- NOT here in a client component

interface ArticleContentProps {
  content: string;
  className?: string;
}

// Replace LaTeX delimiters with KaTeX-rendered HTML
// Supports: [latex]...[/latex], $$...$$ (display), and $...$ (inline)
function renderLatex(content: string): string {
  // Step 0: Pre-process - decode HTML entities that might break our pattern matching
  let result = content
    // Smart typography conversions (WordPress auto-converts these)
    .replace(/&#8211;/g, '-')         // En-dash → minus
    .replace(/&#8212;/g, '-')         // Em-dash → minus  
    .replace(/&ndash;/gi, '-')        // En-dash → minus
    .replace(/&mdash;/gi, '-')        // Em-dash → minus
    .replace(/–/g, '-')               // Actual en-dash character → minus
    .replace(/—/g, '-')               // Actual em-dash character → minus
    .replace(/&#8216;/g, "'")         // Left single quote → apostrophe
    .replace(/&#8217;/g, "'")         // Right single quote → apostrophe
    .replace(/&#8220;/g, '"')         // Left double quote → quote
    .replace(/&#8221;/g, '"')         // Right double quote → quote
    .replace(/'/g, "'")               // Curly apostrophe → straight
    .replace(/'/g, "'")               // Curly quote → straight
    .replace(/"/g, '"')               // Curly quote → straight
    .replace(/"/g, '"')               // Curly quote → straight
    // Standard HTML entities
    .replace(/&#36;/g, '$')           // Decode $ (numeric entity)
    .replace(/&dollar;/gi, '$')       // Decode $ (named entity)
    .replace(/&#123;/g, '{')          // Decode {
    .replace(/&#125;/g, '}')          // Decode }
    .replace(/&lbrace;/gi, '{')       // Decode {
    .replace(/&rbrace;/gi, '}')       // Decode }
    .replace(/&#92;/g, '\\')          // Decode backslash
    .replace(/&bsol;/gi, '\\')        // Decode backslash
    .replace(/&gt;/gi, '>')           // Decode >
    .replace(/&lt;/gi, '<')           // Decode <
    .replace(/&amp;/gi, '&');         // Decode & (do this last!)

  // Handle [latex]...[/latex] tags (legacy/custom format)
  result = result.replace(/\[latex\](.*?)\[\/latex\]/gs, (_, expr) => {
    try {
      return katex.renderToString(expr, {
        throwOnError: false,
        displayMode: false,
      });
    } catch (err) {
      console.error("KaTeX render error:", expr, err);
      return expr;
    }
  });

  // Handle $$...$$ for display math (block equations)
  // Strip <br>, <br/>, <br />, and <p> tags that WordPress may insert inside the formula
  result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_, expr) => {
    try {
      // Clean up WordPress formatting artifacts inside the formula
      const cleanExpr = expr
        .replace(/<br\s*\/?>/gi, ' ')  // Replace <br> with space
        .replace(/<\/?p[^>]*>/gi, '')   // Remove <p> tags
        .replace(/&nbsp;/gi, ' ')       // Replace &nbsp; with space
        .trim();

      return `<div class="katex-display my-6 overflow-x-auto text-center">${katex.renderToString(cleanExpr, {
        throwOnError: false,
        displayMode: true,
      })}</div>`;
    } catch (err) {
      console.error("KaTeX display render error:", expr, err);
      return `$$${expr}$$`;
    }
  });

  // Handle $...$ for inline math
  // Be careful not to match $$ (display math), escaped \$, or currency amounts like $120
  // Only match if the content looks like actual LaTeX (contains backslash, braces, ^, _, etc.)
  result = result.replace(/(?<!\$)\$(?!\$)(?!\d)((?:[^$])+?)\$/g, (match, expr) => {
    // Skip if it looks like currency or doesn't contain LaTeX-like syntax
    const looksLikeLaTeX = /[\\{}^_]|\\[a-zA-Z]+/.test(expr);
    if (!looksLikeLaTeX) {
      // Return the original match unchanged - it's probably not LaTeX
      return match;
    }

    try {
      // Clean up WordPress formatting artifacts
      const cleanExpr = expr
        .replace(/<br\s*\/?>/gi, ' ')   // Replace <br> with space
        .replace(/<\/?[^>]+>/gi, '')    // Remove any HTML tags
        .replace(/&gt;/gi, '>')         // Decode >
        .replace(/&lt;/gi, '<')         // Decode <
        .replace(/&amp;/gi, '&')        // Decode &
        .replace(/&nbsp;/gi, ' ')       // Replace &nbsp; with space
        .trim();

      return katex.renderToString(cleanExpr, {
        throwOnError: false,
        displayMode: false,
      });
    } catch (err) {
      console.error("KaTeX inline render error:", expr, err);
      return `$${expr}$`;
    }
  });

  return result;
}

export function ArticleContent({ content, className }: ArticleContentProps) {
  const contentRef = useRef<HTMLArticleElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Dropcap logic - preserves HTML formatting
      const applyDropCap = (paragraphElement: HTMLParagraphElement) => {
        const html = paragraphElement.innerHTML;
        const text = paragraphElement.textContent;
        if (text && text.trim().length > 0 && !paragraphElement.querySelector('span.dropcap-span')) {
          // Find the first actual letter in the HTML (skip tags)
          const firstLetterMatch = html.match(/^(\s*(?:<[^>]+>)*\s*)([a-zA-Z0-9])/);
          if (firstLetterMatch) {
            const beforeLetter = firstLetterMatch[1] || '';
            const firstLetter = firstLetterMatch[2];
            const restOfHtml = html.slice(beforeLetter.length + 1);
            paragraphElement.innerHTML =
              `${beforeLetter}<span class="dropcap-span float-left text-6xl md:text-7xl font-stilson text-red-600 mr-2 leading-none -mt-1">${firstLetter}</span>${restOfHtml}`;
            return true;
          }
        }
        return false;
      };

      // Reset dropcaps if re-rendered - preserves HTML formatting
      contentRef.current.querySelectorAll('span.dropcap-span').forEach(span => {
        const parent = span.parentNode as HTMLElement;
        if (parent && span.textContent) {
          // Replace the span with just its text content (the letter)
          const textNode = document.createTextNode(span.textContent);
          parent.replaceChild(textNode, span);
        }
      });

      // Apply dropcap ONLY to the first paragraph
      const firstArticleParagraph = contentRef.current.querySelector('p');
      if (firstArticleParagraph) {
        applyDropCap(firstArticleParagraph);
      }

      // Italic font styling
      const italicElements = contentRef.current.querySelectorAll('i, em');
      italicElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.classList.add('font-acaslon');
        }
      });
    }
  }, [content]);

  return (
    <div className={cn(
      "w-full",
      className
    )}>
      <article
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: renderLatex(content) }}
        className={cn(
          "font-acaslon text-primary",
          "prose dark:prose-invert prose-xl max-w-none",
          "overflow-x-hidden border-b"
        )}
      />
    </div>
  );
}
