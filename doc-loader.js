// Configure marked options for better rendering
if (typeof marked !== 'undefined') {
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: true
    });
}

/**
 * Load and render markdown file
 */
async function loadMarkdown(filename) {
    const content = document.getElementById('content');

    if (!filename) {
        content.innerHTML = `
            <div class="loading">
                <h2>❌ No document specified</h2>
                <p>Please provide a markdown file to load.</p>
            </div>
        `;
        return;
    }

    // Show loading
    content.innerHTML = '<div class="loading"><h2>⏳ Loading document...</h2></div>';

    try {
        // Fetch markdown file
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}`);
        }

        const markdown = await response.text();

        // Convert to HTML
        const html = marked.parse(markdown);

        // Display
        content.innerHTML = html;

        // Post-processing
        await postProcessContent();

        // Generate table of contents
        generateTOC();

        // Add back to top button
        addBackToTopButton();

        // Scroll to top
        window.scrollTo(0, 0);

        // Highlight code blocks if highlight.js is available
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
        }

    } catch (error) {
        content.innerHTML = `
            <div class="loading">
                <h2>❌ Error loading document</h2>
                <p>${error.message}</p>
                <p>Make sure the markdown (.md) file "${filename}" exists in the same directory as this HTML file.</p>
                <p><a href="index.html">← Back to Home</a></p>
            </div>
        `;
        console.error('Error loading markdown:', error);
    }
}

/**
 * Post-process the rendered content
 */
async function postProcessContent() {
    const content = document.getElementById('content');

    // Make external links open in new tab
    content.querySelectorAll('a[href^="http"]').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Add copy button to code blocks
    content.querySelectorAll('pre').forEach(pre => {
        const button = document.createElement('button');
        button.className = 'copy-code-button';
        button.textContent = '📋 Copy';
        button.onclick = () => {
            const code = pre.querySelector('code');
            if (code) {
                navigator.clipboard.writeText(code.textContent).then(() => {
                    button.textContent = '✅ Copied!';
                    setTimeout(() => {
                        button.textContent = '📋 Copy';
                    }, 2000);
                });
            }
        };

        pre.style.position = 'relative';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '5px 10px';
        button.style.background = 'rgba(255,255,255,0.2)';
        button.style.border = '1px solid rgba(255,255,255,0.3)';
        button.style.borderRadius = '4px';
        button.style.color = 'white';
        button.style.cursor = 'pointer';
        button.style.fontSize = '0.8em';
        button.style.transition = 'all 0.3s';

        button.onmouseover = () => {
            button.style.background = 'rgba(255,255,255,0.3)';
        };
        button.onmouseout = () => {
            button.style.background = 'rgba(255,255,255,0.2)';
        };

        pre.insertBefore(button, pre.firstChild);
    });

    // Add emoji to certain elements
    enhanceContent();
}

/**
 * Generate table of contents
 */
function generateTOC() {
    const content = document.getElementById('content');
    const headings = content.querySelectorAll('h2, h3');

    if (headings.length < 3) return; // Don't show TOC if too few headings

    const toc = document.createElement('div');
    toc.className = 'toc';
    toc.id = 'table-of-contents';

    const tocTitle = document.createElement('h3');
    tocTitle.textContent = '📑 Table of Contents';
    toc.appendChild(tocTitle);

    const tocList = document.createElement('ul');

    headings.forEach((heading, index) => {
        // Add ID to heading if it doesn't have one
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }

        // Create TOC item
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;

        // Indent h3
        if (heading.tagName === 'H3') {
            li.style.marginLeft = '20px';
            li.style.fontSize = '0.95em';
        }

        // Smooth scroll on click
        link.onclick = (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.pushState(null, null, `#${heading.id}`);
        };

        li.appendChild(link);
        tocList.appendChild(li);
    });

    toc.appendChild(tocList);

    // Insert TOC after first h1 or at beginning
    const firstHeading = content.querySelector('h1');
    if (firstHeading) {
        // Find next element after h1
        let nextEl = firstHeading.nextElementSibling;
        if (nextEl) {
            firstHeading.parentNode.insertBefore(toc, nextEl);
        } else {
            content.appendChild(toc);
        }
    } else {
        content.insertBefore(toc, content.firstChild);
    }
}

/**
 * Add back to top button
 */
function addBackToTopButton() {
    // Remove existing button if any
    const existing = document.querySelector('.back-to-top');
    if (existing) existing.remove();

    const button = document.createElement('a');
    button.href = '#';
    button.className = 'back-to-top';
    button.innerHTML = '↑ Top';
    button.onclick = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.body.appendChild(button);

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
}

/**
 * Enhance content with visual improvements
 */
function enhanceContent() {
    const content = document.getElementById('content');

    // Add checkmarks to checklist items
    content.querySelectorAll('li').forEach(li => {
        const text = li.textContent.trim();
        if (text.startsWith('[ ]')) {
            li.innerHTML = li.innerHTML.replace('[ ]', '<input type="checkbox" disabled> ');
        } else if (text.startsWith('[x]') || text.startsWith('[X]')) {
            li.innerHTML = li.innerHTML.replace(/\[x\]/i, '<input type="checkbox" checked disabled> ');
        }
    });

    // Enhance important paragraphs
    content.querySelectorAll('p').forEach(p => {
        const text = p.textContent.trim();
        if (text.startsWith('⚠️') || text.startsWith('Important:') || text.startsWith('Note:')) {
            p.style.background = '#fff3cd';
            p.style.borderLeft = '4px solid #ffc107';
            p.style.padding = '15px 20px';
            p.style.borderRadius = '5px';
            p.style.margin = '20px 0';
        }
        if (text.startsWith('✅') || text.startsWith('Success:')) {
            p.style.background = '#d4edda';
            p.style.borderLeft = '4px solid #28a745';
            p.style.padding = '15px 20px';
            p.style.borderRadius = '5px';
            p.style.margin = '20px 0';
        }
        if (text.startsWith('❌') || text.startsWith('Error:')) {
            p.style.background = '#f8d7da';
            p.style.borderLeft = '4px solid #dc3545';
            p.style.padding = '15px 20px';
            p.style.borderRadius = '5px';
            p.style.margin = '20px 0';
        }
    });
}

/**
 * Print current document
 */
function printDocument() {
    window.print();
}

/**
 * Download markdown file
 */
function downloadMarkdown(filename) {
    window.location.href = filename;
}

// Add smooth scrolling for hash links
document.addEventListener('DOMContentLoaded', () => {
    // Handle initial hash
    if (window.location.hash) {
        setTimeout(() => {
            const element = document.querySelector(window.location.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
});

// Export functions for use in HTML
if (typeof window !== 'undefined') {
    window.loadMarkdown = loadMarkdown;
    window.printDocument = printDocument;
    window.downloadMarkdown = downloadMarkdown;
}
