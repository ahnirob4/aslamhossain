document.addEventListener('DOMContentLoaded', function() {
            // Create particles
            createParticles();
            
            // Draw neural network
            drawNeuralNetwork();
            
            // Start typing animation
            startTyping();
            
            // Animate on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (entry.target.classList.contains('stats-section')) {
                            animateCounters();
                        }
                        if (entry.target.classList.contains('hero-card')) {
                            animateSkillBars();
                            animateHeroStats();
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            document.querySelectorAll('.stats-section, .hero-card').forEach(el => observer.observe(el));
        });

        function createParticles() {
            const container = document.getElementById('particles');
            for (let i = 0; i < 40; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                container.appendChild(particle);
            }
        }

        function drawNeuralNetwork() {
            const canvas = document.getElementById('neuralCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const nodes = [];
            const connections = [];
            const layers = [4, 6, 6, 4];
            const layerSpacing = canvas.width / (layers.length + 1);
            
            // Create nodes
            layers.forEach((count, layerIndex) => {
                const x = layerSpacing * (layerIndex + 1);
                const nodeSpacing = canvas.height / (count + 1);
                for (let i = 0; i < count; i++) {
                    nodes.push({
                        x: x,
                        y: nodeSpacing * (i + 1),
                        layer: layerIndex,
                        pulse: Math.random() * Math.PI * 2
                    });
                }
            });

            // Create connections
            let nodeIndex = 0;
            for (let l = 0; l < layers.length - 1; l++) {
                const currentLayerStart = nodeIndex;
                const currentLayerEnd = nodeIndex + layers[l];
                const nextLayerStart = currentLayerEnd;
                const nextLayerEnd = nextLayerStart + layers[l + 1];
                
                for (let i = currentLayerStart; i < currentLayerEnd; i++) {
                    for (let j = nextLayerStart; j < nextLayerEnd; j++) {
                        connections.push({ from: i, to: j, progress: Math.random() });
                    }
                }
                nodeIndex = currentLayerEnd;
            }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw connections
                connections.forEach(conn => {
                    const from = nodes[conn.from];
                    const to = nodes[conn.to];
                    
                    ctx.beginPath();
                    ctx.moveTo(from.x, from.y);
                    ctx.lineTo(to.x, to.y);
                    ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    
                    // Animated pulse
                    conn.progress += 0.005;
                    if (conn.progress > 1) conn.progress = 0;
                    
                    const pulseX = from.x + (to.x - from.x) * conn.progress;
                    const pulseY = from.y + (to.y - from.y) * conn.progress;
                    
                    ctx.beginPath();
                    ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
                    ctx.fill();
                });
                
                // Draw nodes
                nodes.forEach(node => {
                    node.pulse += 0.03;
                    const size = 4 + Math.sin(node.pulse) * 2;
                    
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, size + 3, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
                    ctx.stroke();
                });
                
                requestAnimationFrame(animate);
            }
            
            animate();
            
            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }

        const typingTexts = [
            'model.fit(X_train, y_train)',
            'predictions = model.predict(X_test)',
            'accuracy_score(y_test, predictions)',
            'Building AI solutions...',
            'Deep Learning Expert 🧠'
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function startTyping() {
            const element = document.getElementById('typing');
            const currentText = typingTexts[textIndex];
            
            if (isDeleting) {
                element.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                element.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % typingTexts.length;
                typeSpeed = 500;
            }
            
            setTimeout(startTyping, typeSpeed);
        }

        function animateCounters() {
            animateValue('counter1', 0, 25, 2000, '+');
            animateValue('counter2', 0, 50, 2000, '+');
            animateValue('counter3', 0, 500, 2000, '+');
            animateValue('counter4', 0, 8, 2000, '');
        }

        function animateHeroStats() {
            animateValue('stat1', 0, 25, 1500, '+');
            animateValue('stat2', 0, 50, 1500, '+');
            animateValue('stat3', 0, 4, 1500, '+');
        }

        function animateValue(id, start, end, duration, suffix = '') {
            const element = document.getElementById(id);
            if (!element) return;
            
            const range = end - start;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + range * easeProgress);
                
                element.textContent = current.toLocaleString() + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        }

        function animateSkillBars() {
            document.querySelectorAll('.skill-bar-fill').forEach((bar, index) => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                }, index * 200);
            });
        }

        function openModal() {
            document.getElementById('modal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            document.getElementById('modal').classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function handleSubmit(event) {
            event.preventDefault();
            alert('✅ ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে। আমি শীঘ্রই যোগাযোগ করব।');
            event.target.reset();
        }

        function handleHire(event) {
            event.preventDefault();
            alert('🎉 ধন্যবাদ! আপনার রিকোয়েস্ট পেয়েছি। ২৪ ঘন্টার মধ্যে যোগাযোগ করব।');
            closeModal();
            event.target.reset();
        }

        // Close modal on outside click
        document.getElementById('modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Smooth scroll for nav links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', function() {
            const nav = document.querySelector('nav');
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(7, 7, 16, 0.95)';
            } else {
                nav.style.background = 'rgba(7, 7, 16, 0.8)';
            }
        });