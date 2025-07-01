'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface ArticleContentProps {
  content: string;
  className?: string;
}

export function ArticleContent({ content, className }: ArticleContentProps) {
  const contentRef = useRef<HTMLArticleElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const applyDropCap = (paragraphElement: HTMLParagraphElement) => {
        const text = paragraphElement.textContent;
        if (text && text.trim().length > 0 && !paragraphElement.querySelector('span.dropcap-span')) {
          const firstLetter = text.charAt(0);
          const restOfText = text.slice(1);
          paragraphElement.innerHTML = `<span class="dropcap-span float-left text-6xl md:text-7xl font-stilson text-red-600 mr-2 leading-none -mt-1">${firstLetter}</span>${restOfText}`;
          return true;
        }
        return false;
      };

      contentRef.current.querySelectorAll('span.dropcap-span').forEach(span => {
        const parent = span.parentNode as HTMLElement;
        if (parent) {
          let originalText = '';
          parent.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              originalText += node.textContent;
            } else if (node !== span) {
              originalText += (node as HTMLElement).outerHTML || node.textContent || '';
            }
          });
          parent.innerHTML = (span.nextSibling?.textContent || '') ? (span.textContent || '') + (span.nextSibling.textContent || '') : parent.textContent || '';
        }
      });

      const firstArticleParagraph = contentRef.current.querySelector('p');
      let firstParagraphProcessed = false;
      if (firstArticleParagraph) {
        firstParagraphProcessed = applyDropCap(firstArticleParagraph);
      }

      const headings = contentRef.current.querySelectorAll('h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        let nextElement = heading.nextElementSibling;
        while (nextElement && nextElement.tagName !== 'P') {
          nextElement = nextElement.nextElementSibling;
        }
        if (nextElement && nextElement.tagName === 'P') {
          const paragraphAfterHeading = nextElement as HTMLParagraphElement;
          if (!(firstParagraphProcessed && paragraphAfterHeading === firstArticleParagraph)) {
            applyDropCap(paragraphAfterHeading);
          }
        }
      });

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
      "md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8", // Added md:grid-cols-2 for responsive flexibility
      className
    )}>
      <article
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: content }}
        className={cn(
          "font-acaslon text-primary",
          "prose dark:prose-invert prose-xl",
          "md:col-span-2 lg:col-span-2", // Takes 2 columns in md and lg
          "overflow-x-hidden border-b"
        )}
      />
      {/* The third column on large screens is implicitly empty */}
    </div>
  );
}
