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
  result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_, expr) => {
    try {
      const cleanExpr = expr
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<\/?p[^>]*>/gi, '')
        .replace(/&nbsp;/gi, ' ')
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
  result = result.replace(/(?<!\$)\$(?!\$)(?!\d)((?:[^$])+?)\$/g, (match, expr) => {
    const looksLikeLaTeX = /[\\{}^_]|\\[a-zA-Z]+/.test(expr);
    if (!looksLikeLaTeX) {
      return match;
    }

    try {
      const cleanExpr = expr
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<\/?[^>]+>/gi, '')
        .replace(/&gt;/gi, '>')
        .replace(/&lt;/gi, '<')
        .replace(/&amp;/gi, '&')
        .replace(/&nbsp;/gi, ' ')
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
      const applyLeadLetters = (paragraphElement: HTMLParagraphElement) => {
        const html = paragraphElement.innerHTML;
        const text = paragraphElement.textContent;
        if (text && text.trim().length > 0 && !paragraphElement.querySelector('span.lead-letters-span')) {
          // Match leading HTML tags/whitespace followed by content
          const leadMatch = html.match(/^(\s*(?:<[^>]+>)*\s*)([\s\S]*)/);
          if (leadMatch) {
            const beforeText = leadMatch[1] || '';
            const remaining = leadMatch[2];
            // Extract first 4 visible WORDS (skip HTML tags)
            let wordCount = 0;
            let i = 0;
            let leadChars = '';
            let inTag = false;
            let inWord = false;
            while (i < remaining.length && wordCount < 4) {
              const ch = remaining[i];
              if (ch === '<') {
                inTag = true;
                leadChars += ch;
              } else if (ch === '>') {
                inTag = false;
                leadChars += ch;
              } else if (inTag) {
                leadChars += ch;
              } else {
                // Visible character — track word boundaries
                const isSpace = /\s/.test(ch);
                if (!isSpace && !inWord) {
                  // Starting a new word
                  wordCount++;
                  if (wordCount > 4) break;
                  inWord = true;
                } else if (isSpace) {
                  inWord = false;
                }
                leadChars += ch;
              }
              i++;
            }
            // Trim trailing whitespace from lead so spacing looks clean
            const trimmedLead = leadChars.replace(/\s+$/, '');
            const trailingSpace = leadChars.slice(trimmedLead.length);
            const afterChars = trailingSpace + remaining.slice(i);
            if (wordCount > 0) {
              paragraphElement.innerHTML =
                `${beforeText}<span class="lead-letters-span font-space-mono font-bold uppercase text-gray-950 dark:text-gray-100" style="letter-spacing: 0.05em;">${trimmedLead}</span>${afterChars}`;
              return true;
            }
          }
        }
        return false;
      };

      // Clean up any existing lead-letter spans (for re-renders)
      contentRef.current.querySelectorAll('span.lead-letters-span').forEach(span => {
        const parent = span.parentNode as HTMLElement;
        if (parent && span.textContent) {
          const textNode = document.createTextNode(span.textContent);
          parent.replaceChild(textNode, span);
        }
      });

      const firstArticleParagraph = contentRef.current.querySelector('p');
      if (firstArticleParagraph) {
        applyLeadLetters(firstArticleParagraph);
      }

      const italicElements = contentRef.current.querySelectorAll('i, em');
      italicElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.classList.add('font-acaslon');
        }
      });
    }
  }, [content]);

  return (
    // Outer wrapper: full width, centers the article column
    <div className={cn("w-full px-4 sm:px-6", className)}>
      <article
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: renderLatex(content) }}
        className={cn(
          // Magazine-style reading width, left-aligned
          "w-full max-w-[800px]",
          "font-acaslon text-primary",
          "prose dark:prose-invert prose-xl",
          "overflow-x-hidden border-b pb-8"
        )}
      />
    </div>
  );
}