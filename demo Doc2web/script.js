document.addEventListener('DOMContentLoaded', function () {
    const tocList = document.getElementById('toc');
    const mainContent = document.getElementById('main-content');
    const headings = mainContent.querySelectorAll('h2, h3.sub-section-title');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    // Populate Table of Contents
    headings.forEach((heading, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        let id = heading.getAttribute('id');
        if (!id) {
            id = `heading-${index}`;
            heading.setAttribute('id', id);
        }

        link.setAttribute('href', `#${id}`);
        link.textContent = heading.textContent.replace(/^[^\w]+|[^\w]+$/g, "").trim(); // Clean up icon/emoji text

        // Add class for sub-items for styling
        if (heading.tagName === 'H3') {
            link.classList.add('sub-item');
        }

        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });

    // Smooth scroll for ToC links and active state
    tocList.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active class
                document.querySelectorAll('#toc a.active').forEach(activeLink => {
                    activeLink.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        }
    });

    // Scroll to top button functionality
    window.onscroll = function() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollTopBtn.style.display = "block";
            setTimeout(() => scrollTopBtn.style.opacity = "1", 10); // Fade in
        } else {
            scrollTopBtn.style.opacity = "0";
            setTimeout(() => scrollTopBtn.style.display = "none", 300); // Fade out
        }
        
        // Highlight ToC item based on scroll position
        let currentSectionId = '';
        headings.forEach(heading => {
            const sectionTop = heading.offsetTop - 100; // Adjust offset as needed
            if (window.scrollY >= sectionTop) {
                currentSectionId = heading.getAttribute('id');
            }
        });

        document.querySelectorAll('#toc a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    // Add simple scroll animations to sections
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                // observer.unobserve(entry.target); // Optional: stop observing after animation
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    document.querySelectorAll('section, .cover-section').forEach(el => {
        // Ensure animation is paused initially
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
     // Initial active state for ToC if page loads on a section
    let initialSectionId = '';
    const hash = window.location.hash;
    if (hash) {
        initialSectionId = hash.substring(1);
    } else {
         // If no hash, default to the first section or introduction
        if (headings.length > 0) {
            initialSectionId = headings[0].getAttribute('id');
        }
    }
    if(initialSectionId){
        const initialLink = document.querySelector(`#toc a[href="#${initialSectionId}"]`);
        if(initialLink) initialLink.classList.add('active');
    }

});