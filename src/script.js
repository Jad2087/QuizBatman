// Enregistre les plugins nécessaires
gsap.registerPlugin(SplitText, ScrollTrigger, Draggable, MotionPathPlugin, MorphSVGPlugin );

document.addEventListener("DOMContentLoaded", () => {
  const questions = document.querySelectorAll(".question-section");

  questions.forEach((questionSection) => {
    const options = questionSection.querySelectorAll(".list-group-item");

    options.forEach((option) => {
      option.addEventListener("click", () => {
        // Retirer la classe 'active' des autres options de la même question
        options.forEach((opt) => opt.classList.remove("active"));

        // Ajouter la classe 'active' à l'option cliquée
        option.classList.add("active");

        // Enregistrer la réponse sélectionnée
        const selectedAnswer = option.textContent.trim();
        console.log("Réponse sélectionnée :", selectedAnswer);
      });
    });
  });
});

document.getElementById("result-button").addEventListener("click", function () {
  const questions = document.querySelectorAll(".question-section");
  let score = 0;
  let totalQuestions = questions.length;
  let answersList = [];

  // Parcours des sections de questions
  questions.forEach((questionSection, index) => {
    const selectedOption = questionSection.querySelector(".list-group-item.active");

    // Vérification si une option est sélectionnée et si elle est correcte
    if (selectedOption && selectedOption.dataset.correct === "true") {
      score++;
      answersList.push(`Question ${index + 1}: ${selectedOption.textContent.trim()}`);
    } else {
      answersList.push(`Question ${index + 1}: Incorrect`);
    }
  });

   // Vérifier s'il existe déjà une section de résultats et la supprimer
   const existingResultSection = document.querySelector(".result-section");
   if (existingResultSection) {
     existingResultSection.remove(); // Supprimer l'ancien résultat
   }

  // Création et affichage de la section des résultats
  const resultSection = document.createElement("div");
  resultSection.className = "result-section text-center mt-5 p-4 bg-dark text-white rounded";
  resultSection.innerHTML = `
    <h3 class="result-title">Résultat</h3>
    <p class="result-score">Vous avez obtenu un score de <span id="score">${score}</span>/${totalQuestions}</p>
    <p class="result-correct-answers">Les bonnes réponses :</p>
    <ul class="list-unstyled">
      ${answersList.map(answer => `<li>${answer}</li>`).join('')}
    </ul>
  `;

  document.querySelector(".container").appendChild(resultSection);

  // Animation GSAP pour afficher la section des résultats
  gsap.fromTo(resultSection, 
    { opacity: 0, y: 50 }, // Animation d'entrée (invisible, décalée)
    { opacity: 1, y: 0, duration: 1, ease: "power2.out" } // Effet de fondu et de mouvement
  );
});


// Initialisation de l'animation du titre du quiz
const quiz = gsap.timeline(),
  splitTextInstance = new SplitText("#quizTitle", { type: "words,chars" }); // Renommé pour éviter le conflit avec la classe SplitText

// Récupération du tableau des caractères
const chars = splitTextInstance.chars; 

// Définition de la perspective pour l'élément
gsap.set("#quizTitle", { perspective: 400 });

// Animation des caractères du titre avec un effet 3D
quiz.from(chars, {
  duration: 5,                     
  opacity: 0,                     
  scale: 0,                       
  y: 80,                           
  rotationX: 180,                  
  transformOrigin: "0% 50% -50",   
  ease: "back",                    
  stagger: 0.01                   
});

// Fonction pour animer le texte avec ScrollTrigger
const animateTextWithScroll = (selector, start, end, scrub) => {
  // Diviser le texte en caractères
  const mySplitTextInstance = new SplitText(selector, { type: "chars" });
  const chars = mySplitTextInstance.chars;

  // Appliquer l'animation sur chaque caractère
  gsap.to(chars, {
    opacity: 0,              
    x: 20,                   
    duration: 0.1,          
    stagger: 0.1,          
    ease: "power1.out",      
    scrollTrigger: {         
      trigger: selector,     
      start: start,          
      end: end,              
      scrub: scrub,          
    }
  });
};



// Appliquer l'animation sur différents éléments
animateTextWithScroll("#quizTitle", "top 38%", "bottom top", 1);
animateTextWithScroll("#secret", "top 38%", "bottom top", 1);
animateTextWithScroll("#pas", "top 52%", "bottom top", 1);

// Animation des questions et options
document.addEventListener("DOMContentLoaded", () => {
  const questions = document.querySelectorAll(".question-section");

  questions.forEach((questionSection) => {
    const questionTitle = questionSection.querySelector("h2");
    const questionText = questionSection.querySelector("h3");
    const options = questionSection.querySelectorAll(".list-group-item");

    // Animation pour le titre de la question
    gsap.fromTo(questionTitle, 
      { opacity: 0, y: -50 }, 
      {
        opacity: 4,
        y: 0,
        duration: 2,
        delay: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: questionTitle,
          start: "top 100%",
          end: "bottom top",
          scrub: 1,
        }
      }
    );

    // Animation pour le texte de la question
    gsap.fromTo(questionText, 
      { opacity: 0, x: -50 }, 
      {
        opacity: 1,
        x: 0,
        duration: 3,
        delay: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: questionText,
          start: "top 95%",
          end: "bottom top",
          scrub: 1
        }
      }
    );

    // Animation pour les options
    options.forEach((option, index) => {
      gsap.fromTo(option, 
        { opacity: 0, y: 30  }, 
        {
          y: 0,
          opacity: 1.5,
          duration: 1,
          ease: "back.out(1.7)",
          delay: index * 0.2,
          scrollTrigger: {
            trigger: option,
            start: "top 90%",
            end: "bottom top",
            scrub: 1
          }
        }
      );
    });
  });
});

// Sélection des éléments nécessaires
const batmanSymbol = document.querySelector(".batman-symbol");
const targetZone = document.querySelector(".circle-zone");
const question1 = document.querySelector(".question-section:nth-child(2)"); // Sélectionne la question 1

// Masquer la question au départ
question1.style.visibility = "hidden";

// Initialisation de l'interaction Draggable
Draggable.create(batmanSymbol, {
  bounds: "body", // Limiter le déplacement au corps
  type: "x,y",    // Permet le déplacement en 2D
  onDragEnd: function () {
    // Détecter la collision avec la zone cible
    const symbolBounds = batmanSymbol.getBoundingClientRect();
    const targetBounds = targetZone.getBoundingClientRect();

    const isCollision = (
      symbolBounds.right > targetBounds.left &&
      symbolBounds.left < targetBounds.right &&
      symbolBounds.bottom > targetBounds.top &&
      symbolBounds.top < targetBounds.bottom
    );

    if (isCollision) {
      // Collision détectée : changement d'apparence de la zone cible
      targetZone.style.backgroundColor = "#ffcc00"; // Couleur de surbrillance
      targetZone.style.boxShadow = "0 0 20px 10px rgba(255, 204, 0, 0.5)"; // Effet lumineux

      // Afficher la question 1 avec GSAP
      gsap.fromTo(
        question1,
        {
          y: 50, 
          opacity: 0, 
          visibility: "visible" // Rendre visible
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: "power2.out" 
        }
      );
    } else {
      // Pas de collision : réinitialiser l'apparence de la zone cible
      targetZone.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
      targetZone.style.boxShadow = "0 0 15px 5px rgba(255, 235, 59, 0.5)";

      // Cacher la question 1 avec GSAP
      gsap.to(question1, {
        opacity: 0, 
        y: -50, 
        duration: 0.5, 
        onComplete: () => {
          question1.style.visibility = "hidden"; // Masquer après l'animation
        }
      });
    }
  },
});


gsap.to("#cap", {
  motionPath: {
    path: "#motionPath1",       
    align: "#motionPath1",      
    alignOrigin: [0.5, 0.5],    
    autoRotate: true            
  },
  duration: 10,                
  ease: "power1.inOut",       
  scrollTrigger: {
    trigger: ".motionpath-container1", 
    start: "top center",              
    end: "bottom center",              
    scrub: 1                           
  }
});

gsap.to("#batmobileee", {
  motionPath: {
    path: "#motionPath",       
    align: "#motionPath",      
    alignOrigin: [0.5, 0.5],   
    autoRotate: true,         
    start: 1,                 
    end: 0                     
  },
  duration: 20,               
  ease: "power1.inOut",       
  scrollTrigger: {
    trigger: ".motionpath-container", 
    start: "top center",             
    end: "bottom center",           
    scrub: 1                      
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Animation de morphing pour #bat1 vers #bat2
  gsap.to("#bat1", {
    morphSVG: "#bat2",  
    repeat: -1,         
    yoyo: true,       
    repeatDelay: 0.2,   
    duration: 0.5      
  });

  gsap.to("#cat", {
    morphSVG: "#bats",  
    repeat: -1,         
    yoyo: true,         
    repeatDelay: 0.2,   
    duration: 0.5       
  });

  // Animation pour l'arrière-plan
  gsap.to(".fond", {
    backgroundPosition: "100% 50%", 
    scrollTrigger: {
      trigger: ".fond",            
      start: "top bottom",         
      end: "bottom top",            
      scrub: 1                    
    }
  });
});
