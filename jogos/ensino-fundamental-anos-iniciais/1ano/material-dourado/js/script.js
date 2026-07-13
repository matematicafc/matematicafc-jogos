const quizData = [
            // TIPO: COMPOSIÇÃO (Clica na resposta certa)
            {
                type: "compor",
                question: "Bento está tentando descobrir que número o material dourado na mesa está formando. Há 3 barras e 7 cubos. Que número é esse?",
                bars: 3, cubes: 7,
                options: ["37", "73", "30", "47"], correct: 0
            },
            {
                type: "compor",
                question: "Tuco organizou suas cenouras usando blocos na mesa da horta. Estão brilhando 5 barras e 2 cubos. Qual o número formado?",
                bars: 5, cubes: 2,
                options: ["25", "52", "50", "62"], correct: 1
            },
            {
                type: "compor",
                question: "Ajude o urso Bento! Na bancada da floresta, há 2 barras e 9 cubos. Que número compomos com essas peças?",
                options: ["20", "39", "29", "92"], correct: 2,
                bars: 2, cubes: 9
            },
            {
                type: "compor",
                question: "O coelho Tuco empilhou 6 barras e 4 cubos de material dourado. Clique no número correto que representa essa quantia.",
                options: ["46", "60", "66", "64"], correct: 3,
                bars: 6, cubes: 4
            },
            {
                type: "compor",
                question: "Bento quer saber o total de galhos recolhidos representados por 4 barras e 1 cubo na mesa de estudos. Que número formou?",
                options: ["41", "14", "40", "51"], correct: 0,
                bars: 4, cubes: 1
            },
            {
                type: "compor",
                question: "Olhe o material dourado que o Tuco deixou perto da árvore: 7 barras e 5 cubos. Qual número aparece se juntarmos tudo?",
                options: ["57", "75", "70", "85"], correct: 1,
                bars: 7, cubes: 5
            },
            {
                type: "compor",
                question: "Bento espalhou algumas peças na esteira de piquenique. São 1 barra e 8 cubos. Qual o número composto?",
                options: ["10", "81", "18", "28"], correct: 2,
                bars: 1, cubes: 8
            },
            {
                type: "compor",
                question: "Na horta de Tuco, o material dourado mostra 8 barras e 3 cubos. Que algarismo representa essa situação?",
                options: ["38", "80", "88", "83"], correct: 3,
                bars: 8, cubes: 3
            },
            {
                type: "compor",
                question: "Bento colocou na mesa de jogos exatamente 5 barras e 6 cubos. Descubra e clique no número correto.",
                options: ["56", "65", "50", "60"], correct: 0,
                bars: 5, cubes: 6
            },
            {
                type: "compor",
                question: "Tuco quer registrar o estoque de melancias usando 9 barras e 0 cubos. Que número está na mesa?",
                options: ["9", "90", "99", "19"], correct: 1,
                bars: 9, cubes: 0
            },

            // TIPO: DECOMPOSIÇÃO (Monta clicando nos botões para preencher a caixa)
            {
                type: "decompor",
                question: "O coelho Tuco pretende decompor o número 45 com o material dourado. Vamos ajudá-lo a colocar as peças certas na caixa?",
                targetBars: 4, targetCubes: 5
            },
            {
                type: "decompor",
                question: "O urso Bento quer guardar o número 28 dentro do seu baú de tesouros usando barras e cubos. O que ele deve colocar?",
                targetBars: 2, targetCubes: 8
            },
            {
                type: "decompor",
                question: "Tuco precisa representar o total de 61 sementes na caixa de separação rápida. Coloque as dezenas e unidades necessárias:",
                targetBars: 6, targetCubes: 1
            },
            {
                type: "decompor",
                question: "Bento ganhou o desafio e precisa montar o número 39 na horta de rabanetes. Ajude-o a escolher as peças certas.",
                targetBars: 3, targetCubes: 9
            },
            {
                type: "decompor",
                question: "Vamos ajudar o Tuco? O painel eletrônico da árvore pede para decompor o número 54. Leve as dezenas e unidades para a caixa.",
                targetBars: 5, targetCubes: 4
            },
            {
                type: "decompor",
                question: "Bento precisa organizar 17 pedrinhas mágicas no seu pote de jogos usando material dourado. Como fica?",
                targetBars: 1, targetCubes: 7
            },
            {
                type: "decompor",
                question: "Tuco quer repartir o número 72 em dezenas e unidades exatas dentro da sua mochila de viagens. Ajude-o!",
                targetBars: 7, targetCubes: 2
            },
            {
                type: "decompor",
                question: "O urso Bento encontrou o número 86 escrito em uma folha e quer decompô-lo na bandeja. Quantas barras e cubos ele precisa colocar?",
                targetBars: 8, targetCubes: 6
            },
            {
                type: "decompor",
                question: "Na horta escolar, Tuco precisa colocar peças de material dourado na caixa até completar o valor 33. Vamos lá?",
                targetBars: 3, targetCubes: 3
            },
            {
                type: "decompor",
                question: "Bento quer finalizar a última tarefa do dia colocando barras e cubos na balança para somar 92. O que ele deve escolher?",
                targetBars: 9, targetCubes: 2
            }
        ];

        let shuffledQuestions = [];
        let currentQuestion = 0;
        let hits = 0;
        let errors = 0;
        let audioCtx = null;

        let currentBarsInBox = 0;
        let currentCubesInBox = 0;
        let decompositionLocked = false;
        let activeDrag = null;

        function initAudio() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        }

        function playSound(type) {
            initAudio();
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'correct') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); 
                osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); 
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.25);
            } else if (type === 'wrong') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.2);
            } else {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.05);
            }
        }

        function shuffleArray(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }

        function gerenciarTransicaoAnuncio() {
            initAudio();
            document.getElementById('welcome-screen').classList.remove('active');
            document.getElementById('welcome-screen').style.display = "none";
            
            document.getElementById('tela-anuncio-inicio').classList.add('active');
            document.getElementById('tela-anuncio-inicio').style.display = "block";
            
            setTimeout(function() {
                document.getElementById('tela-anuncio-inicio').classList.remove('active');
                document.getElementById('tela-anuncio-inicio').style.display = "none";
                startQuiz();
            }, 4000);
        }

        function startQuiz() {
            shuffledQuestions = shuffleArray(quizData).slice(0, 20);
            document.getElementById('quiz-screen').classList.add('active');
            document.getElementById('quiz-screen').style.display = "block";
            loadQuestion();
        }

        function loadQuestion() {
            cancelarArrasteAtivo();
            document.getElementById('question-number').innerText = `Pergunta ${currentQuestion + 1} de ${shuffledQuestions.length}`;
            document.getElementById('hits-counter').innerText = `Acertos: ${hits}`;
            document.getElementById('errors-counter').innerText = `Erros: ${errors}`;
            
            const progressPercent = (currentQuestion / shuffledQuestions.length) * 100;
            document.getElementById('progress-bar').style.width = `${progressPercent}%`;
            document.querySelector('.progress-bar-container').setAttribute('aria-valuenow', String(currentQuestion));

            const q = shuffledQuestions[currentQuestion];
            document.getElementById('question-text').innerText = q.question;

            const zona = document.getElementById('zona-interativa');
            const optionsContainer = document.getElementById('options-container');
            const btnConfirmar = document.getElementById('btn-confirmar-decompor');
            const questionType = document.getElementById('question-type');
            
            zona.innerHTML = '';
            optionsContainer.innerHTML = '';
            btnConfirmar.style.display = 'none';
            decompositionLocked = false;

            if (q.type === 'compor') {
                questionType.innerText = 'Compondo números';
                const mesa = document.createElement('div');
                mesa.className = 'mesa-material';
                
                const grupoDz = document.createElement('div');
                grupoDz.className = 'grupo-dezenas';
                for(let i=0; i<q.bars; i++) {
                    const barra = document.createElement('div');
                    barra.className = 'barra-dz';
                    grupoDz.appendChild(barra);
                }

                const grupoUn = document.createElement('div');
                grupoUn.className = 'grupo-unidades';
                for(let i=0; i<q.cubes; i++) {
                    const cubo = document.createElement('div');
                    cubo.className = 'cubo-un';
                    grupoUn.appendChild(cubo);
                }

                mesa.appendChild(grupoDz);
                mesa.appendChild(grupoUn);
                zona.appendChild(mesa);

                q.options.forEach((opt, index) => {
                    const button = document.createElement('button');
                    button.className = 'option-btn';
                    button.innerText = opt;
                    button.onclick = () => selectOptionCompor(index);
                    optionsContainer.appendChild(button);
                });

            } else {
                questionType.innerText = 'Decompondo números';
                currentBarsInBox = 0;
                currentCubesInBox = 0;

                const areaDec = document.createElement('div');
                areaDec.className = 'area-decomposicao';

                const caixa = document.createElement('div');
                caixa.className = 'caixa-destino';
                caixa.id = 'caixa-blocos';
                caixa.innerHTML = '<div class="caixa-label">Arraste as peças para a caixa</div><p id="caixa-vazia-msg" class="caixa-vazia-msg">A caixa está vazia...</p>';
                
                const painel = document.createElement('div');
                painel.className = 'painel-selecao';

                const btnAddBarra = criarFonteArrastavel('barra');

                const btnAddCubo = criarFonteArrastavel('cubo');

                painel.appendChild(btnAddBarra);
                painel.appendChild(btnAddCubo);

                const btnLimpar = document.createElement('button');
                btnLimpar.className = 'btn-limpar';
                btnLimpar.type = 'button';
                btnLimpar.id = 'btn-limpar-caixa';
                btnLimpar.innerText = 'Limpar Caixa';
                btnLimpar.onclick = resetarCaixa;

                const actionRow = document.createElement('div');
                actionRow.className = 'action-row';
                actionRow.appendChild(btnLimpar);

                areaDec.appendChild(caixa);
                areaDec.appendChild(painel);
                areaDec.appendChild(actionRow);
                zona.appendChild(areaDec);

                btnConfirmar.style.display = 'inline-block';
            }
        }

        function criarFonteArrastavel(tipo) {
            const fonte = document.createElement('button');
            fonte.type = 'button';
            fonte.className = 'peca-fonte';
            fonte.dataset.tipo = tipo;
            fonte.setAttribute('aria-label', tipo === 'barra' ? 'Arrastar uma dezena para a caixa' : 'Arrastar uma unidade para a caixa');
            fonte.innerHTML = tipo === 'barra'
                ? '<span class="barra-dz" aria-hidden="true"></span><span class="drag-copy"><strong>1 Dezena</strong><small>Arraste a barra</small></span>'
                : '<span class="cubo-un" aria-hidden="true"></span><span class="drag-copy"><strong>1 Unidade</strong><small>Arraste o cubo</small></span>';
            fonte.addEventListener('pointerdown', iniciarArraste);
            return fonte;
        }

        function iniciarArraste(event) {
            if (decompositionLocked || event.button > 0) return;
            event.preventDefault();
            const fonte = event.currentTarget;
            const tipo = fonte.dataset.tipo;
            const peca = fonte.querySelector(tipo === 'barra' ? '.barra-dz' : '.cubo-un');
            const ghost = peca.cloneNode(true);
            ghost.classList.add('drag-ghost');
            document.body.appendChild(ghost);
            activeDrag = { pointerId: event.pointerId, fonte, tipo, ghost };
            fonte.setPointerCapture?.(event.pointerId);
            fonte.classList.add('is-dragging');
            document.body.classList.add('dragging-piece');
            moverFantasma(event.clientX, event.clientY);
            window.addEventListener('pointermove', moverArraste, { passive: false });
            window.addEventListener('pointerup', finalizarArraste);
            window.addEventListener('pointercancel', finalizarArraste);
        }

        function moverFantasma(x, y) {
            if (!activeDrag) return;
            activeDrag.ghost.style.left = `${x}px`;
            activeDrag.ghost.style.top = `${y}px`;
        }

        function pontoSobreCaixa(x, y) {
            const caixa = document.getElementById('caixa-blocos');
            if (!caixa) return false;
            const rect = caixa.getBoundingClientRect();
            return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        }

        function moverArraste(event) {
            if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
            event.preventDefault();
            moverFantasma(event.clientX, event.clientY);
            const caixa = document.getElementById('caixa-blocos');
            if (caixa) caixa.classList.toggle('drag-over', pontoSobreCaixa(event.clientX, event.clientY));
        }

        function finalizarArraste(event) {
            if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
            event.preventDefault();
            const tipo = activeDrag.tipo;
            const dropValido = !decompositionLocked && pontoSobreCaixa(event.clientX, event.clientY);
            limparEstadoArraste();
            if (dropValido) adicionarPeca(tipo);
        }

        function limparEstadoArraste() {
            const caixa = document.getElementById('caixa-blocos');
            if (caixa) caixa.classList.remove('drag-over');
            if (activeDrag) {
                if (activeDrag.fonte.hasPointerCapture?.(activeDrag.pointerId)) {
                    activeDrag.fonte.releasePointerCapture(activeDrag.pointerId);
                }
                activeDrag.fonte.classList.remove('is-dragging');
                activeDrag.ghost.remove();
                activeDrag = null;
            }
            document.body.classList.remove('dragging-piece');
            window.removeEventListener('pointermove', moverArraste);
            window.removeEventListener('pointerup', finalizarArraste);
            window.removeEventListener('pointercancel', finalizarArraste);
        }

        function cancelarArrasteAtivo() {
            if (activeDrag) limparEstadoArraste();
        }

        function adicionarPeca(tipo) {
            if (decompositionLocked) return;
            playSound('click');
            const msgVazia = document.getElementById('caixa-vazia-msg');
            if (msgVazia) msgVazia.remove();

            const caixa = document.getElementById('caixa-blocos');

            let gDz = caixa.querySelector('.grupo-dezenas');
            let gUn = caixa.querySelector('.grupo-unidades');

            if (!gDz) {
                gDz = document.createElement('div');
                gDz.className = 'grupo-dezenas';
                caixa.appendChild(gDz);
            }
            if (!gUn) {
                gUn = document.createElement('div');
                gUn.className = 'grupo-unidades';
                caixa.appendChild(gUn);
            }

            if (tipo === 'barra') {
                currentBarsInBox++;
                const b = document.createElement('div');
                b.className = 'barra-dz';
                gDz.appendChild(b);
            } else {
                currentCubesInBox++;
                const c = document.createElement('div');
                c.className = 'cubo-un';
                gUn.appendChild(c);
            }
        }

        function resetarCaixa() {
            if (decompositionLocked) return;
            currentBarsInBox = 0;
            currentCubesInBox = 0;
            const caixa = document.getElementById('caixa-blocos');
            caixa.innerHTML = '<div class="caixa-label">Arraste as peças para a caixa</div><p id="caixa-vazia-msg" class="caixa-vazia-msg">A caixa está vazia...</p>';
        }

        function selectOptionCompor(selectedIndex) {
            const q = shuffledQuestions[currentQuestion];
            const buttons = document.getElementsByClassName('option-btn');

            for (let i = 0; i < buttons.length; i++) {
                buttons[i].disabled = true;
            }

            if (selectedIndex === q.correct) {
                hits++;
                buttons[selectedIndex].classList.add('correct');
                playSound('correct');
            } else {
                errors++;
                buttons[selectedIndex].classList.add('wrong');
                buttons[q.correct].classList.add('correct'); 
                playSound('wrong');
            }

            proximaPergunta();
        }

        function checarDecomposicao() {
            const q = shuffledQuestions[currentQuestion];
            const caixa = document.getElementById('caixa-blocos');
            decompositionLocked = true;
            cancelarArrasteAtivo();

            if (currentBarsInBox === q.targetBars && currentCubesInBox === q.targetCubes) {
                hits++;
                caixa.classList.add('resposta-correta');
                playSound('correct');
            } else {
                errors++;
                caixa.classList.add('resposta-errada');
                const feedback = document.createElement('div');
                feedback.className = 'feedback-decomposicao';
                feedback.innerText = `O correto era: ${q.targetBars} dezenas e ${q.targetCubes} unidades!`;
                caixa.appendChild(feedback);
                playSound('wrong');
            }

            document.getElementById('btn-confirmar-decompor').disabled = true;
            document.getElementById('btn-limpar-caixa').disabled = true;
            document.querySelectorAll('.peca-fonte').forEach((fonte) => {
                fonte.disabled = true;
                fonte.classList.add('is-disabled');
            });
            proximaPergunta();
        }

        function proximaPergunta() {
            setTimeout(() => {
                currentQuestion++;
                document.getElementById('btn-confirmar-decompor').disabled = false;
                if (currentQuestion < shuffledQuestions.length) {
                    loadQuestion();
                } else {
                    showResults();
                }
            }, 1200);
        }

        function showResults() {
            document.getElementById('quiz-screen').classList.remove('active');
            document.getElementById('quiz-screen').style.display = "none";
            document.getElementById('result-screen').classList.add('active');
            document.getElementById('final-score').innerText = `${hits}/${shuffledQuestions.length}`;
            
            const messageElement = document.getElementById('performance-message');
            const ratio = hits / shuffledQuestions.length;

            if (ratio === 1) {
                messageElement.innerText = "Espetacular! Você domina o material dourado perfeitamente! ★";
            } else if (ratio >= 0.7) {
                messageElement.innerText = "Muito bom! Você entende muito bem as dezenas e unidades! ✦";
            } else if (ratio >= 0.5) {
                messageElement.innerText = "Bom trabalho! Pratique um pouco mais para ficar craque! ↗";
            } else {
                messageElement.innerText = "Continue tentando! Refazer o quiz vai ajudar você a fixar os blocos! ◆";
            }
        }

        function restartQuiz() {
            currentQuestion = 0;
            hits = 0;
            errors = 0;
            document.getElementById('result-screen').classList.remove('active');
            document.getElementById('result-screen').style.display = "none";
            gerenciarTransicaoAnuncio();
        }
