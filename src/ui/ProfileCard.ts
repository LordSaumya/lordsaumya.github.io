export class ProfileCard {
    public static mount(container: HTMLElement) {
        container.innerHTML = `
            <div class="flex flex-col items-center text-center cursor-default bg-[#030408]/70 backdrop-blur-md border border-q-wire rounded-xl p-6 md:bg-transparent md:backdrop-blur-none md:border-transparent md:p-0 transition-all duration-300 shadow-lg md:shadow-none">
                <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 drop-shadow-lg">SAUMYA SHAH</h1>
                <h2 class="text-q-accent font-semibold tracking-widest text-sm uppercase mb-4 drop-shadow-md">PhD Candidate | <a href="https://www.quantuminformatics-cdt.ac.uk/" target="_blank" class="hover:text-white transition-colors duration-300 pointer-events-auto cursor-pointer">Quantum Informatics CDT</a></h2>
                <p class="text-gray-300 text-sm md:text-base max-w-md mb-6 leading-relaxed drop-shadow-md">
                    Physics-Informed and Quantum Machine Learning
                </p>
                
                <div class="flex gap-4 flex-wrap justify-center relative">
                    <!-- CV -->
                    <a href="files/CV.pdf" title="CV" target="_blank" class="p-3 border border-q-wire hover:border-q-accent hover:text-q-accent hover:shadow-[0_0_12px_rgba(0,229,255,0.4)] bg-[#030408]/60 backdrop-blur-sm rounded-full transition-all text-gray-400 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </a>
                    
                    <!-- Research (Google Scholar) -->
                    <a href="https://scholar.google.com/citations?user=_wg9-8gAAAAJ&hl=en" target="_blank" title="Google Scholar" class="p-3 border border-q-wire hover:border-q-accent hover:text-q-accent hover:shadow-[0_0_12px_rgba(0,229,255,0.4)] bg-[#030408]/60 backdrop-blur-sm rounded-full transition-all text-gray-400 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                    </a>
                    
                    <!-- Email -->
                    <button id="email-btn" title="Copy Email" class="p-3 border border-q-wire hover:border-q-accent hover:text-q-accent hover:shadow-[0_0_12px_rgba(0,229,255,0.4)] bg-[#030408]/60 backdrop-blur-sm rounded-full transition-all text-gray-400 flex items-center justify-center relative cursor-pointer pointer-events-auto">
                        <span id="email-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </span>
                        <span id="copy-notification" class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-q-accent font-medium tracking-wide opacity-0 transition-opacity duration-300 pointer-events-none whitespace-nowrap drop-shadow-md">Copied!</span>
                    </button>
                    
                    <!-- GitHub -->
                    <a href="https://github.com/LordSaumya" target="_blank" title="GitHub" class="p-3 border border-q-wire hover:border-q-accent hover:text-q-accent hover:shadow-[0_0_12px_rgba(0,229,255,0.4)] bg-[#030408]/60 backdrop-blur-sm rounded-full transition-all text-gray-400 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="w-5 h-5"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>

                    <!-- LinkedIn -->
                    <a href="https://www.linkedin.com/in/ss-shah/" target="_blank" title="LinkedIn" class="p-3 border border-q-wire hover:border-q-accent hover:text-q-accent hover:shadow-[0_0_12px_rgba(0,229,255,0.4)] bg-[#030408]/60 backdrop-blur-sm rounded-full transition-all text-gray-400 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                </div>
            </div>
        `;

        const emailBtn = document.getElementById('email-btn');
        if (emailBtn) {
            emailBtn.addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText('work@saumya.sh').then(() => {
                    const iconSpan = document.getElementById('email-icon');
                    const notification = document.getElementById('copy-notification');
                    
                    if (iconSpan) {
                        iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                        // Force the parent button to immediately adopt the accent color during the "copied" state
                        emailBtn.classList.add('text-q-accent', 'border-q-accent', 'shadow-[0_0_12px_rgba(0,229,255,0.4)]');
                    }
                    if (notification) {
                        notification.classList.remove('opacity-0');
                        notification.classList.add('opacity-100');
                    }

                    setTimeout(() => {
                        if (iconSpan) {
                            iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
                            emailBtn.classList.remove('text-q-accent', 'border-q-accent', 'shadow-[0_0_12px_rgba(0,229,255,0.4)]');
                        }
                        if (notification) {
                            notification.classList.remove('opacity-100');
                            notification.classList.add('opacity-0');
                        }
                    }, 2000);
                });
            });
        }
    }
}