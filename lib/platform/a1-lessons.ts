export type LessonSection = {
  vocabulary: {
    words: { word: string; translation: string; example: string; phonetic?: string }[];
  };
  reading: {
    title: string;
    text: string;
    questions: { question: string; options: string[]; correct: number }[];
  };
  listening: {
    title: string;
    transcript: string;
    questions: { question: string; options: string[]; correct: number }[];
  };
  speaking: {
    prompt: string;
    tips: string[];
    model: string;
  };
  writing: {
    prompt: string;
    tips: string[];
    model: string;
    minWords: number;
  };
  game: {
    type: "match" | "fill" | "order" | "quiz";
    title: string;
    instructions: string;
    items: { question: string; answer: string }[];
  };
};

export type Lesson = {
  id: string;
  order: number;
  title: string;
  theme: string;
  wefSkill: string;
  communicativeFunction: string;
  grammarCore: string;
  finalProduct: string;
  xpReward: number;
  durationMin: number;
  content: LessonSection;
};

export const A1_LESSONS: Lesson[] = [
  {
    id: "a1-01",
    order: 1,
    title: "Hello, Future Me",
    theme: "Self-awareness",
    wefSkill: "Self-awareness",
    communicativeFunction: "Apresentar-se",
    grammarCore: "Verb to be",
    finalProduct: "Profile Card",
    xpReward: 120,
    durationMin: 20,
    content: {
      vocabulary: {
        words: [
          { word: "name", translation: "nome", example: "My name is Ana.", phonetic: "/neɪm/" },
          { word: "age", translation: "idade", example: "I am 25 years old.", phonetic: "/eɪdʒ/" },
          { word: "from", translation: "de / origem", example: "I am from Brazil.", phonetic: "/frɒm/" },
          { word: "student", translation: "estudante", example: "I am a student.", phonetic: "/ˈstjuːdənt/" },
          { word: "teacher", translation: "professor(a)", example: "She is a teacher.", phonetic: "/ˈtiːtʃər/" },
          { word: "happy", translation: "feliz", example: "I am very happy today.", phonetic: "/ˈhæpi/" },
          { word: "future", translation: "futuro", example: "My future is bright.", phonetic: "/ˈfjuːtʃər/" },
          { word: "dream", translation: "sonho", example: "My dream is to travel.", phonetic: "/driːm/" },
        ],
      },
      reading: {
        title: "Meet Sofia",
        text: `Hi! My name is Sofia. I am 22 years old. I am from São Paulo, Brazil. I am a student and I love English. My teacher is Mr. James. He is from the United States. He is very funny and kind. I am happy in my English class. My dream is to work in an international company. I am ready for my future!`,
        questions: [
          { question: "How old is Sofia?", options: ["20", "22", "25", "28"], correct: 1 },
          { question: "Where is Sofia from?", options: ["Rio de Janeiro", "Buenos Aires", "São Paulo", "Brasília"], correct: 2 },
          { question: "What is Sofia's dream?", options: ["To be a teacher", "To travel to the USA", "To work in an international company", "To learn Spanish"], correct: 2 },
          { question: "Where is Mr. James from?", options: ["England", "Australia", "Canada", "The United States"], correct: 3 },
        ],
      },
      listening: {
        title: "First Day of Class",
        transcript: `Teacher: Good morning, everyone! I am Mr. Roberts. I am your English teacher. What is your name?\nStudent: My name is Lucas. I am from Curitiba. I am 19 years old.\nTeacher: Great! Are you a student or do you work?\nStudent: I am a student. I am studying business.\nTeacher: Wonderful! And are you happy to be here?\nStudent: Yes! I am very excited. English is important for my future.`,
        questions: [
          { question: "What is the teacher's name?", options: ["Mr. James", "Mr. Roberts", "Mr. Lucas", "Mr. Smith"], correct: 1 },
          { question: "How old is Lucas?", options: ["17", "18", "19", "20"], correct: 2 },
          { question: "What is Lucas studying?", options: ["Engineering", "Medicine", "Business", "Law"], correct: 2 },
          { question: "How does Lucas feel about English?", options: ["Nervous", "Bored", "Confused", "Excited"], correct: 3 },
        ],
      },
      speaking: {
        prompt: "Introduce yourself in English! Talk about your name, age, where you are from, and one dream for your future.",
        tips: [
          "Start with: 'Hi, my name is...'",
          "Use 'I am' (or 'I'm') for all sentences",
          "Speak slowly and clearly",
          "End with: 'Nice to meet you!'",
        ],
        model: "Hi! My name is [Name]. I am [age] years old. I am from [city], Brazil. I am a [student/professional]. My dream is to [your dream]. Nice to meet you!",
      },
      writing: {
        prompt: "Create your Profile Card in English. Write a short paragraph (5–8 sentences) introducing yourself.",
        tips: [
          "Use Verb to be: I am / He is / She is",
          "Include: name, age, city, job/study, and one dream",
          "Use capital letters for names and countries",
          "End with something positive about your future",
        ],
        model: "My name is Sofia. I am 22 years old. I am from São Paulo, Brazil. I am a student at a business school. My teacher is Mr. James. I am very motivated to learn English. My dream is to work in an international company. I am ready for my future!",
        minWords: 40,
      },
      game: {
        type: "match",
        title: "Profile Card Challenge",
        instructions: "Match each question with the correct answer about yourself.",
        items: [
          { question: "What is your name?", answer: "My name is ___." },
          { question: "How old are you?", answer: "I am ___ years old." },
          { question: "Where are you from?", answer: "I am from ___." },
          { question: "Are you a student?", answer: "Yes, I am. / No, I'm not." },
          { question: "What is your dream?", answer: "My dream is to ___." },
        ],
      },
    },
  },
  {
    id: "a1-02",
    order: 2,
    title: "My Smart Routine",
    theme: "Resilience",
    wefSkill: "Resilience",
    communicativeFunction: "Falar da rotina",
    grammarCore: "Simple Present",
    finalProduct: "Smart Routine",
    xpReward: 120,
    durationMin: 20,
    content: {
      vocabulary: {
        words: [
          { word: "wake up", translation: "acordar", example: "I wake up at 6 am.", phonetic: "/weɪk ʌp/" },
          { word: "breakfast", translation: "café da manhã", example: "I eat breakfast every day.", phonetic: "/ˈbrekfəst/" },
          { word: "study", translation: "estudar", example: "I study English at night.", phonetic: "/ˈstʌdi/" },
          { word: "exercise", translation: "exercitar-se", example: "She exercises every morning.", phonetic: "/ˈeksəsaɪz/" },
          { word: "work", translation: "trabalhar", example: "He works from home.", phonetic: "/wɜːk/" },
          { word: "sleep", translation: "dormir", example: "I sleep eight hours.", phonetic: "/sliːp/" },
          { word: "always", translation: "sempre", example: "I always drink water.", phonetic: "/ˈɔːlweɪz/" },
          { word: "usually", translation: "normalmente", example: "She usually reads at night.", phonetic: "/ˈjuːʒuəli/" },
        ],
      },
      reading: {
        title: "Carlos's Morning Routine",
        text: `Carlos is a resilient person. He always wakes up at 5:30 am. First, he drinks a glass of water. Then he exercises for 30 minutes. After that, he takes a shower and eats a healthy breakfast. Carlos studies English every day for 20 minutes. He usually reads news in English. He works from 9 am to 6 pm. At night, he reviews his goals and sleeps at 10 pm. His smart routine helps him achieve his dreams.`,
        questions: [
          { question: "What time does Carlos wake up?", options: ["5:00 am", "5:30 am", "6:00 am", "6:30 am"], correct: 1 },
          { question: "How long does Carlos exercise?", options: ["15 minutes", "20 minutes", "30 minutes", "45 minutes"], correct: 2 },
          { question: "How long does Carlos study English each day?", options: ["10 minutes", "20 minutes", "30 minutes", "1 hour"], correct: 1 },
          { question: "What does Carlos do at night before sleeping?", options: ["Watches TV", "Calls friends", "Reviews his goals", "Cooks dinner"], correct: 2 },
        ],
      },
      listening: {
        title: "My Daily Routine",
        transcript: `Hi, I'm Priya. Let me tell you about my daily routine. I wake up at 6 am every day. I don't use my phone immediately. First, I do yoga for 15 minutes. Then I make coffee and eat fruit for breakfast. I study English for 30 minutes before work. I start work at 8:30 am. I usually eat lunch at home. After work, I walk in the park. I cook dinner and relax with a book. I always sleep before 11 pm. This routine makes me feel strong and ready!`,
        questions: [
          { question: "What time does Priya wake up?", options: ["5 am", "5:30 am", "6 am", "7 am"], correct: 2 },
          { question: "What does Priya do first in the morning?", options: ["Makes coffee", "Checks her phone", "Does yoga", "Eats breakfast"], correct: 2 },
          { question: "When does Priya study English?", options: ["At night", "After work", "Before work", "During lunch"], correct: 2 },
          { question: "What does Priya do after work?", options: ["Watches TV", "Walks in the park", "Goes to the gym", "Calls friends"], correct: 1 },
        ],
      },
      speaking: {
        prompt: "Describe your daily routine in English. Use Simple Present and frequency adverbs (always, usually, sometimes, never).",
        tips: [
          "Start with: 'My routine starts at...'",
          "Use frequency words: always, usually, sometimes, never",
          "Use time expressions: in the morning, at noon, at night",
          "End with how your routine helps you",
        ],
        model: "My routine starts at 6 am. I always wake up and drink water. Then I usually exercise for 20 minutes. I sometimes study English before work. At night, I never sleep after 11 pm. My smart routine helps me stay focused and healthy!",
      },
      writing: {
        prompt: "Write your Smart Routine Card. Describe your ideal daily routine using Simple Present tense.",
        tips: [
          "Use: I wake up / I eat / I study / I sleep",
          "Add frequency: always, usually, sometimes",
          "Include morning, afternoon and night",
          "Explain why this routine is important to you",
        ],
        model: "My smart routine starts at 6 am. I always wake up early and drink water. I usually exercise for 30 minutes in the morning. I eat a healthy breakfast and study English for 20 minutes. I work from 9 am to 6 pm. I sometimes walk after work. At night, I read and always sleep before 11 pm. This routine helps me reach my goals!",
        minWords: 50,
      },
      game: {
        type: "order",
        title: "Build Carlos's Routine",
        instructions: "Put the activities in the correct order from morning to night.",
        items: [
          { question: "1st", answer: "Wake up and drink water" },
          { question: "2nd", answer: "Exercise for 30 minutes" },
          { question: "3rd", answer: "Eat breakfast" },
          { question: "4th", answer: "Study English" },
          { question: "5th", answer: "Work" },
          { question: "6th", answer: "Sleep before 11 pm" },
        ],
      },
    },
  },
  {
    id: "a1-03",
    order: 3,
    title: "People & Teams",
    theme: "Empathy",
    wefSkill: "Empathy",
    communicativeFunction: "Descrever pessoas",
    grammarCore: "be + adjectives",
    finalProduct: "Ideal Teammate",
    xpReward: 120,
    durationMin: 20,
    content: {
      vocabulary: {
        words: [
          { word: "kind", translation: "gentil", example: "She is very kind to everyone.", phonetic: "/kaɪnd/" },
          { word: "creative", translation: "criativo(a)", example: "He is a creative person.", phonetic: "/kriˈeɪtɪv/" },
          { word: "responsible", translation: "responsável", example: "They are responsible workers.", phonetic: "/rɪˈspɒnsɪbəl/" },
          { word: "patient", translation: "paciente", example: "A good teacher is patient.", phonetic: "/ˈpeɪʃənt/" },
          { word: "confident", translation: "confiante", example: "She is confident in her skills.", phonetic: "/ˈkɒnfɪdənt/" },
          { word: "team", translation: "equipe", example: "We are a great team.", phonetic: "/tiːm/" },
          { word: "colleague", translation: "colega", example: "My colleague is very helpful.", phonetic: "/ˈkɒliːɡ/" },
          { word: "honest", translation: "honesto(a)", example: "He is always honest.", phonetic: "/ˈɒnɪst/" },
        ],
      },
      reading: {
        title: "The Dream Team",
        text: `At Wind Plus, there is an amazing team. Maria is the team leader. She is responsible, patient, and very organized. Her colleague Tom is creative and always full of new ideas. He is also kind and helpful. Ana is the newest member. She is a bit shy, but she is very honest and hardworking. Together, they are a perfect team. They believe that empathy is the most important skill in a team. When people are kind and patient, the team is strong and happy.`,
        questions: [
          { question: "What is Maria's role?", options: ["Designer", "New member", "Team leader", "Colleague"], correct: 2 },
          { question: "What is Tom like?", options: ["Shy and quiet", "Creative and kind", "Responsible and organized", "Honest but lazy"], correct: 1 },
          { question: "How is Ana described?", options: ["Confident and loud", "Creative and funny", "Shy but honest and hardworking", "Kind but irresponsible"], correct: 2 },
          { question: "What do they believe is the most important skill?", options: ["Creativity", "Organization", "Confidence", "Empathy"], correct: 3 },
        ],
      },
      listening: {
        title: "My Ideal Teammate",
        transcript: `Hello! Today I want to talk about my ideal teammate. My ideal teammate is kind and patient. He or she is also responsible and honest. I think creativity is very important in a team. My best colleague at work is Diana. She is creative, confident, and always helpful. She is never rude or impatient. When we work together, we are very productive. I believe a good team is like a family. Everyone is different, but together we are strong. What is your ideal teammate like?`,
        questions: [
          { question: "What quality does the speaker mention first?", options: ["Creative", "Kind", "Confident", "Honest"], correct: 1 },
          { question: "What is Diana like?", options: ["Shy and quiet", "Rude and impatient", "Creative, confident, and helpful", "Responsible but boring"], correct: 2 },
          { question: "What does the speaker compare a good team to?", options: ["A school", "A company", "A family", "A sport"], correct: 2 },
          { question: "What word describes the opposite of 'kind'?", options: ["Patient", "Rude", "Honest", "Creative"], correct: 1 },
        ],
      },
      speaking: {
        prompt: "Describe your ideal teammate or a person you admire. Use 'be + adjectives' and give examples.",
        tips: [
          "Start with: 'My ideal teammate is...'",
          "Use at least 3 adjectives",
          "Give a specific example: 'For example, he/she is always...'",
          "End with why this person inspires you",
        ],
        model: "My ideal teammate is kind, creative, and responsible. For example, she always helps the team with new ideas. She is never impatient or rude. I think she is an amazing person because she makes everyone feel important. She inspires me to be a better professional.",
      },
      writing: {
        prompt: "Write your Ideal Teammate Card. Describe the perfect colleague using 'be + adjectives'.",
        tips: [
          "Use: He/She is + adjective",
          "Use 'also' and 'and' to connect ideas",
          "Mention at least 4 qualities",
          "Explain why these qualities are important",
        ],
        model: "My ideal teammate is Maria. She is responsible, patient, and very organized. She is also creative and kind. Maria is never rude or impatient. I think she is the perfect colleague because she always helps the team. When Maria is in the team, we are strong and productive. She is my inspiration!",
        minWords: 50,
      },
      game: {
        type: "match",
        title: "Adjective Match",
        instructions: "Match each adjective with its Portuguese translation.",
        items: [
          { question: "kind", answer: "gentil" },
          { question: "patient", answer: "paciente" },
          { question: "creative", answer: "criativo" },
          { question: "honest", answer: "honesto" },
          { question: "responsible", answer: "responsável" },
        ],
      },
    },
  },
  {
    id: "a1-04",
    order: 4,
    title: "Technology Around Me",
    theme: "Tech literacy",
    wefSkill: "Tech literacy",
    communicativeFunction: "Falar sobre tecnologia",
    grammarCore: "use / can",
    finalProduct: "Digital Toolkit",
    xpReward: 120,
    durationMin: 20,
    content: {
      vocabulary: {
        words: [
          { word: "smartphone", translation: "celular/smartphone", example: "I use my smartphone every day.", phonetic: "/ˈsmɑːtfəʊn/" },
          { word: "app", translation: "aplicativo", example: "This app is very useful.", phonetic: "/æp/" },
          { word: "internet", translation: "internet", example: "I can access the internet anywhere.", phonetic: "/ˈɪntənet/" },
          { word: "laptop", translation: "notebook", example: "She uses a laptop for work.", phonetic: "/ˈlæptɒp/" },
          { word: "search", translation: "pesquisar", example: "I can search for information online.", phonetic: "/sɜːtʃ/" },
          { word: "download", translation: "baixar/descarregar", example: "Can you download this file?", phonetic: "/ˈdaʊnləʊd/" },
          { word: "connect", translation: "conectar", example: "I can connect to Wi-Fi here.", phonetic: "/kəˈnekt/" },
          { word: "digital", translation: "digital", example: "We live in a digital world.", phonetic: "/ˈdɪdʒɪtəl/" },
        ],
      },
      reading: {
        title: "My Digital Life",
        text: `Technology is part of my life. I use my smartphone to communicate with friends. I can send messages, make calls, and take photos. My laptop is very important for work. I use it to write documents and join online meetings. I can search for information on the internet in seconds. I also use apps for studying English, managing my finances, and staying healthy. Technology can help us save time and be more productive. But we can also use it to learn new skills and connect with people around the world. I love my digital toolkit!`,
        questions: [
          { question: "What does the person use a smartphone for?", options: ["Only for calls", "Communicate, send messages, take photos", "Only for photos", "Watch movies"], correct: 1 },
          { question: "What does the person use a laptop for?", options: ["Gaming and entertainment", "Write documents and online meetings", "Only for emails", "Social media"], correct: 1 },
          { question: "What can technology help us do?", options: ["Save time and be more productive", "Replace all human jobs", "Make us antisocial", "Only entertain us"], correct: 0 },
          { question: "What apps does the person use?", options: ["Games only", "English, finances, and health", "Social media only", "Music and video"], correct: 1 },
        ],
      },
      listening: {
        title: "The Digital Toolkit",
        transcript: `Hi everyone! Let me tell you about my digital toolkit. I can use many apps for different things. First, I use a language app to study English. I can practice vocabulary and grammar every day. Second, I use a calendar app to organize my schedule. I can add meetings and set reminders. Third, I use a note app. I can write my ideas and read them later. I also use video call apps to connect with my team. Technology is amazing! I can work from anywhere in the world. Can you imagine life without technology? I can't!`,
        questions: [
          { question: "What does the speaker use a language app for?", options: ["Watch videos", "Study English vocabulary and grammar", "Chat with friends", "Listen to music"], correct: 1 },
          { question: "What does the calendar app help with?", options: ["Sending emails", "Organizing schedule and reminders", "Studying languages", "Taking notes"], correct: 1 },
          { question: "What does the speaker use video call apps for?", options: ["Entertainment", "Gaming", "Connect with team", "Online shopping"], correct: 2 },
          { question: "What is the speaker's opinion about technology?", options: ["It is dangerous", "It is boring", "It is amazing", "It is expensive"], correct: 2 },
        ],
      },
      speaking: {
        prompt: "Talk about the technology you use. What can you do with your devices and apps?",
        tips: [
          "Use: I use / I can / I can't",
          "Mention at least 3 devices or apps",
          "Explain what you CAN do with each",
          "Share your favourite digital tool",
        ],
        model: "I use technology every day. I use my smartphone to communicate and I can send messages in seconds. I also use a laptop for work. I can write documents and join meetings. My favourite app is a language app because I can practice English every day. I can't imagine life without my digital toolkit!",
      },
      writing: {
        prompt: "Create your Digital Toolkit Card. List and describe the technology you use and what you CAN do with each.",
        tips: [
          "Use: I use [device/app] + to + verb",
          "Use: I can + verb",
          "Include at least 4 items",
          "Mention one thing technology helps you achieve",
        ],
        model: "My Digital Toolkit:\n1. Smartphone — I use it to communicate. I can call, message, and take photos.\n2. Laptop — I use it for work. I can write, search, and join meetings.\n3. English App — I use it to study. I can practice vocabulary every day.\n4. Calendar App — I use it to organize. I can manage my schedule easily.\nTechnology helps me save time and reach my goals!",
        minWords: 60,
      },
      game: {
        type: "fill",
        title: "Tech Sentence Builder",
        instructions: "Complete each sentence with 'use' or 'can'.",
        items: [
          { question: "I ___ my smartphone to send messages.", answer: "use" },
          { question: "She ___ access the internet anywhere.", answer: "can" },
          { question: "We ___ apps to study English.", answer: "use" },
          { question: "You ___ download this app for free.", answer: "can" },
          { question: "He ___ a laptop for online meetings.", answer: "uses" },
        ],
      },
    },
  },
  {
    id: "a1-05",
    order: 5,
    title: "Food & Well-being",
    theme: "Well-being",
    wefSkill: "Well-being",
    communicativeFunction: "Falar de preferências",
    grammarCore: "like / don't like",
    finalProduct: "Healthy Menu",
    xpReward: 120,
    durationMin: 20,
    content: {
      vocabulary: {
        words: [
          { word: "healthy", translation: "saudável", example: "I like healthy food.", phonetic: "/ˈhelθi/" },
          { word: "vegetables", translation: "legumes/verduras", example: "I like vegetables in my salad.", phonetic: "/ˈvedʒtəbəlz/" },
          { word: "fruit", translation: "fruta", example: "I love tropical fruit.", phonetic: "/fruːt/" },
          { word: "protein", translation: "proteína", example: "Chicken is a good protein.", phonetic: "/ˈprəʊtiːn/" },
          { word: "prefer", translation: "preferir", example: "I prefer water to soda.", phonetic: "/prɪˈfɜːr/" },
          { word: "delicious", translation: "delicioso(a)", example: "This food is delicious!", phonetic: "/dɪˈlɪʃəs/" },
          { word: "snack", translation: "lanche", example: "I don't like unhealthy snacks.", phonetic: "/snæk/" },
          { word: "meal", translation: "refeição", example: "Breakfast is my favourite meal.", phonetic: "/miːl/" },
        ],
      },
      reading: {
        title: "Elena's Healthy Menu",
        text: `Elena cares about her well-being. She likes healthy food and hates junk food. For breakfast, she likes eggs, fruit, and green tea. She doesn't like sugary cereals. For lunch, Elena prefers salad with chicken or fish. She likes vegetables but she doesn't like fried food. For dinner, she usually eats soup or rice with beans. She loves Brazilian food! For snacks, she likes nuts and yogurt. She doesn't like chips or chocolate. Elena believes that food is medicine. She says: "I like to eat well because it gives me energy for my dreams!"`,
        questions: [
          { question: "What does Elena like for breakfast?", options: ["Sugary cereals", "Eggs, fruit, and green tea", "Toast and butter", "Pancakes with syrup"], correct: 1 },
          { question: "What does Elena prefer for lunch?", options: ["Pizza and soda", "Fried chicken", "Salad with chicken or fish", "Sandwich and chips"], correct: 2 },
          { question: "What doesn't Elena like?", options: ["Vegetables", "Fruit", "Junk food", "Rice"], correct: 2 },
          { question: "What does Elena believe about food?", options: ["Food is entertainment", "Food is medicine", "Food is expensive", "Food is boring"], correct: 1 },
        ],
      },
      listening: {
        title: "My Food Preferences",
        transcript: `Hi! I'm talking today about food and well-being. I like cooking at home because I can control what I eat. I love fruit, especially mangoes and bananas. I like vegetables too, but I don't like broccoli very much. For protein, I prefer chicken and eggs. I don't like red meat. I like rice and beans — it's my favourite Brazilian meal! I don't like fast food at all. I think it's bad for your health. I prefer water and natural juices. I don't like soda. I believe that eating well makes you feel better and think more clearly. What food do you like?`,
        questions: [
          { question: "What fruit does the speaker love?", options: ["Apples and oranges", "Grapes and strawberries", "Mangoes and bananas", "Pineapple and kiwi"], correct: 2 },
          { question: "What protein does the speaker prefer?", options: ["Red meat", "Fish and shrimp", "Chicken and eggs", "Pork and lamb"], correct: 2 },
          { question: "What doesn't the speaker like to drink?", options: ["Water", "Natural juices", "Green tea", "Soda"], correct: 3 },
          { question: "Why doesn't the speaker like fast food?", options: ["It's expensive", "It's bad for health", "It's not tasty", "It takes too long"], correct: 1 },
        ],
      },
      speaking: {
        prompt: "Talk about your food preferences. What do you like and dislike? What is your ideal healthy meal?",
        tips: [
          "Use: I like / I love / I prefer / I don't like / I hate",
          "Name specific foods",
          "Explain why you like or dislike each food",
          "Describe your ideal healthy menu",
        ],
        model: "I like healthy food. I love fruit, especially mangoes. I also like vegetables and rice with beans. I prefer chicken to red meat. I don't like fried food because it makes me feel tired. My ideal meal is salad with grilled chicken and fruit for dessert. I believe good food gives me energy!",
      },
      writing: {
        prompt: "Create your Healthy Menu Card. Write your ideal breakfast, lunch, and dinner using 'like / don't like / prefer'.",
        tips: [
          "Organize by meals: Breakfast / Lunch / Dinner",
          "Use: I like, I love, I prefer, I don't like",
          "Add why each choice is healthy",
          "Include at least one favourite Brazilian food",
        ],
        model: "My Healthy Menu:\nBreakfast: I like eggs and fruit. I love green tea. I don't like sugary cereals.\nLunch: I prefer salad with chicken. I like vegetables but I don't like fried food.\nDinner: I love rice with beans — it's my favourite Brazilian meal! I also like soup.\nSnacks: I like nuts and yogurt. I don't like chips.\nI believe eating well is the secret to energy and happiness!",
        minWords: 60,
      },
      game: {
        type: "quiz",
        title: "Healthy or Not?",
        instructions: "Answer: do you think this food is healthy? Choose 'Healthy' or 'Not healthy'.",
        items: [
          { question: "Grilled chicken with salad", answer: "Healthy" },
          { question: "Chips and soda", answer: "Not healthy" },
          { question: "Fruit salad", answer: "Healthy" },
          { question: "Fast food burger with fries", answer: "Not healthy" },
          { question: "Rice, beans, and vegetables", answer: "Healthy" },
        ],
      },
    },
  },
  {
    id: "a1-06",
    order: 6,
    title: "Places & Cities",
    theme: "Global citizenship",
    wefSkill: "Global citizenship",
    communicativeFunction: "Descrever lugares",
    grammarCore: "there is / there are",
    finalProduct: "Better City Map",
    xpReward: 120,
    durationMin: 20,
    content: {
      vocabulary: {
        words: [
          { word: "park", translation: "parque", example: "There is a beautiful park near my house.", phonetic: "/pɑːk/" },
          { word: "hospital", translation: "hospital", example: "There is a hospital in the city centre.", phonetic: "/ˈhɒspɪtəl/" },
          { word: "museum", translation: "museu", example: "There are three museums in this city.", phonetic: "/mjuˈziːəm/" },
          { word: "library", translation: "biblioteca", example: "There is a library near the school.", phonetic: "/ˈlaɪbrəri/" },
          { word: "neighbourhood", translation: "bairro/vizinhança", example: "My neighbourhood is very safe.", phonetic: "/ˈneɪbəhʊd/" },
          { word: "transport", translation: "transporte", example: "There is good public transport here.", phonetic: "/ˈtrænspɔːt/" },
          { word: "street", translation: "rua", example: "There are many cafés on this street.", phonetic: "/striːt/" },
          { word: "square", translation: "praça", example: "There is a big square in the city centre.", phonetic: "/skweər/" },
        ],
      },
      reading: {
        title: "My City, My Pride",
        text: `My city is Curitiba, in the south of Brazil. It is a beautiful and modern city. There are many parks and green areas. The most famous park is the Barigui Park — there is a lake and there are many sports areas. There is also an amazing cultural centre called the Wire Opera House. There are excellent museums and art galleries. There is very good public transport — the bus system is famous in the world. There aren't many traffic problems because people use buses and bikes. There is a great library system too. I love my city because there is always something to do and explore!`,
        questions: [
          { question: "Where is Curitiba?", options: ["North of Brazil", "South of Brazil", "Centre of Brazil", "Northeast of Brazil"], correct: 1 },
          { question: "What is there in Barigui Park?", options: ["Only trees", "A lake and sports areas", "Museums and galleries", "A famous theatre"], correct: 1 },
          { question: "Why aren't there many traffic problems?", options: ["Few people live there", "Everyone has cars", "People use buses and bikes", "The streets are very wide"], correct: 2 },
          { question: "What is the Wire Opera House?", options: ["A park", "A museum", "A cultural centre", "A library"], correct: 2 },
        ],
      },
      listening: {
        title: "My Ideal City",
        transcript: `Hello! Today I want to describe my ideal city. In my ideal city, there is a big central park where people can walk, run, and relax. There are schools and hospitals in every neighbourhood. There are also libraries and cultural centres for everyone. There aren't many cars in the city centre — there are safe bike lanes and excellent public transport. There is clean air and there are green spaces everywhere. There are international restaurants and local markets. I think a great city needs people who care about it. There is a sense of community — people help each other. Is there a city like that? Maybe we can build it!`,
        questions: [
          { question: "What is in the central park of the ideal city?", options: ["Shopping centres", "Museums and galleries", "Place to walk, run, and relax", "Schools and hospitals"], correct: 2 },
          { question: "What isn't there in the city centre?", options: ["Public transport", "Many cars", "Bike lanes", "Restaurants"], correct: 1 },
          { question: "What does the speaker think a great city needs?", options: ["More technology", "Tall buildings", "People who care about it", "International companies"], correct: 2 },
          { question: "What does 'sense of community' mean here?", options: ["Everyone is rich", "People help each other", "There are many shops", "The city is very modern"], correct: 1 },
        ],
      },
      speaking: {
        prompt: "Describe your city or neighbourhood using 'there is / there are'. Then describe your IDEAL city.",
        tips: [
          "Use: There is + singular / There are + plural",
          "Use: There isn't / There aren't for negatives",
          "Describe real places: parks, transport, schools",
          "End with your dream improvement for the city",
        ],
        model: "In my neighbourhood, there is a park and a supermarket. There are many restaurants and a school. There aren't many bike lanes, which is a problem. In my ideal city, there are bike lanes everywhere and excellent public transport. There is a big cultural centre and there are green parks for families. I want a city where everyone feels safe and happy!",
      },
      writing: {
        prompt: "Create your Better City Map in writing. Describe your city (or neighbourhood) and then your IDEAL improved version.",
        tips: [
          "Use: There is a... / There are many...",
          "Use: There isn't / There aren't to say what's missing",
          "Divide into: My City Today / My Ideal City",
          "Use connecting words: also, but, however, because",
        ],
        model: "My City Today:\nI live in São Paulo. There are many people and buildings. There are good hospitals and universities. However, there aren't enough parks and bike lanes. There is a lot of traffic.\n\nMy Ideal City:\nIn my ideal city, there are parks in every neighbourhood. There is excellent public transport. There aren't many cars in the centre. There are schools, hospitals, and libraries for everyone. There is a sense of community because people care about each other!",
        minWords: 70,
      },
      game: {
        type: "fill",
        title: "There is or There are?",
        instructions: "Choose the correct form: 'There is' or 'There are'.",
        items: [
          { question: "___ a beautiful park near my house.", answer: "There is" },
          { question: "___ many museums in this city.", answer: "There are" },
          { question: "___ a hospital on the main street.", answer: "There is" },
          { question: "___ three libraries in my neighbourhood.", answer: "There are" },
          { question: "___ no traffic problems in my ideal city.", answer: "There are" },
        ],
      },
    },
  },
  {
    id: "a1-07",
    order: 7,
    title: "Future Jobs",
    theme: "Lifelong learning",
    wefSkill: "Lifelong learning",
    communicativeFunction: "Falar de profissões",
    grammarCore: "want to / work with",
    finalProduct: "Future Skills Card",
    xpReward: 120,
    durationMin: 20,
    content: {
      vocabulary: {
        words: [
          { word: "career", translation: "carreira", example: "I want to build a great career.", phonetic: "/kəˈrɪər/" },
          { word: "skill", translation: "habilidade", example: "English is an important skill.", phonetic: "/skɪl/" },
          { word: "profession", translation: "profissão", example: "My profession is engineering.", phonetic: "/prəˈfeʃən/" },
          { word: "opportunity", translation: "oportunidade", example: "This job is a great opportunity.", phonetic: "/ˌɒpəˈtjuːnɪti/" },
          { word: "goal", translation: "objetivo/meta", example: "My goal is to become a leader.", phonetic: "/ɡəʊl/" },
          { word: "interview", translation: "entrevista", example: "I want to ace my job interview.", phonetic: "/ˈɪntəvjuː/" },
          { word: "leadership", translation: "liderança", example: "She has great leadership skills.", phonetic: "/ˈliːdəʃɪp/" },
          { word: "global", translation: "global", example: "I want to work in a global company.", phonetic: "/ˈɡləʊbəl/" },
        ],
      },
      reading: {
        title: "Jobs of the Future",
        text: `The world of work is changing fast. Many people want to work with technology, health, and sustainability. In the future, the most important jobs will need digital skills, creativity, and the ability to work with people from different cultures. Bruno wants to be a data analyst. He wants to work with numbers and technology to help companies make better decisions. Marina wants to work with renewable energy. She wants to help protect the environment. Lia wants to be a UX designer. She wants to work with technology and creativity to create better digital experiences. All three want to improve their English because it is the language of global opportunities.`,
        questions: [
          { question: "What will future jobs need?", options: ["Only physical strength", "Digital skills, creativity, and cultural ability", "Traditional knowledge only", "Manual labour skills"], correct: 1 },
          { question: "What does Bruno want to do?", options: ["Work with renewable energy", "Be a UX designer", "Be a data analyst", "Work in healthcare"], correct: 2 },
          { question: "What does Marina want to protect?", options: ["Technology", "Cultural heritage", "The environment", "Digital data"], correct: 2 },
          { question: "Why do all three want to improve English?", options: ["Because it's easy", "Because it's required by law", "Because it's the language of global opportunities", "Because they live abroad"], correct: 2 },
        ],
      },
      listening: {
        title: "My Future Career",
        transcript: `Hi! I want to talk about my future career. I want to be an international business manager. I want to work with people from different countries and cultures. I want to use English every day in my job. Right now, I am studying business and learning English. I also want to develop my leadership skills. I want to lead a team in the future. I don't want to stay in one place — I want to travel and learn about the world. I believe that lifelong learning is the key to success. I want to always be curious and open to new opportunities. What do you want to do in the future?`,
        questions: [
          { question: "What does the speaker want to be?", options: ["A doctor", "An international business manager", "A data analyst", "A UX designer"], correct: 1 },
          { question: "What does the speaker want to develop?", options: ["Cooking skills", "Musical talent", "Leadership skills", "Athletic ability"], correct: 2 },
          { question: "What does the speaker want to do beyond working?", options: ["Stay in one place", "Travel and learn about the world", "Work from home", "Retire early"], correct: 1 },
          { question: "What does the speaker believe is the key to success?", options: ["Money", "Connections", "Luck", "Lifelong learning"], correct: 3 },
        ],
      },
      speaking: {
        prompt: "Talk about your future job. Use 'I want to + verb' and describe your career goals.",
        tips: [
          "Use: I want to be / I want to work with / I want to learn",
          "Describe your dream job",
          "Explain what skills you want to develop",
          "Say why English is important for your future",
        ],
        model: "In the future, I want to be a marketing manager. I want to work with creative teams and international clients. I want to develop my communication and leadership skills. I want to travel for work and connect with people from different cultures. I am learning English because I want to access global opportunities. English is my key to the future!",
      },
      writing: {
        prompt: "Create your Future Skills Card. Describe your dream career and the skills you want to develop.",
        tips: [
          "Use: I want to + verb",
          "Mention your dream job",
          "List 3 skills you want to develop",
          "Explain why English is part of your plan",
        ],
        model: "My Future Skills Card:\nDream Job: International Marketing Manager\nI want to work with global clients and creative teams. I want to develop three key skills:\n1. Leadership — I want to lead a team of professionals.\n2. Communication — I want to present ideas clearly.\n3. Digital marketing — I want to work with social media and data.\nI want to improve my English because it opens doors to global opportunities. My goal is to be a leader in my field in 5 years!",
        minWords: 60,
      },
      game: {
        type: "match",
        title: "Jobs & Skills",
        instructions: "Match each job with the main skill it requires.",
        items: [
          { question: "Data Analyst", answer: "work with numbers and data" },
          { question: "UX Designer", answer: "work with technology and creativity" },
          { question: "Teacher", answer: "work with people and knowledge" },
          { question: "Engineer", answer: "work with machines and systems" },
          { question: "Manager", answer: "work with teams and leadership" },
        ],
      },
    },
  },
  {
    id: "a1-08",
    order: 8,
    title: "Problems & Solutions",
    theme: "Analytical thinking",
    wefSkill: "Analytical thinking",
    communicativeFunction: "Propor solução",
    grammarCore: "need / imperatives",
    finalProduct: "Problem Solution",
    xpReward: 120,
    durationMin: 20,
    content: {
      vocabulary: {
        words: [
          { word: "problem", translation: "problema", example: "We need to solve this problem.", phonetic: "/ˈprɒbləm/" },
          { word: "solution", translation: "solução", example: "I have a solution for this issue.", phonetic: "/səˈluːʃən/" },
          { word: "improve", translation: "melhorar", example: "We need to improve our communication.", phonetic: "/ɪmˈpruːv/" },
          { word: "analyse", translation: "analisar", example: "Analyse the situation before deciding.", phonetic: "/ˈænəlaɪz/" },
          { word: "suggest", translation: "sugerir", example: "I suggest we meet tomorrow.", phonetic: "/səˈdʒest/" },
          { word: "urgent", translation: "urgente", example: "This is an urgent problem.", phonetic: "/ˈɜːdʒənt/" },
          { word: "strategy", translation: "estratégia", example: "We need a better strategy.", phonetic: "/ˈstrætɪdʒi/" },
          { word: "together", translation: "juntos", example: "Let's solve this together.", phonetic: "/təˈɡeðər/" },
        ],
      },
      reading: {
        title: "Solving Real Problems",
        text: `Every day, we face problems at work, at home, and in society. Analytical thinking helps us find solutions. First, identify the problem clearly. Don't panic — stay calm and think. Second, analyse the causes. Ask: "Why is this happening?" Third, think of possible solutions. Write them down. Fourth, choose the best solution and take action. Don't wait — act now! Finally, evaluate the result. Ask: "Did it work? What can I improve?" At Wind Plus, we teach students to use English to communicate solutions. Improve your vocabulary. Practise your writing. Speak with confidence. Use English as a tool to solve real-world problems.`,
        questions: [
          { question: "What is the first step in solving a problem?", options: ["Find solutions immediately", "Identify the problem clearly", "Take action", "Evaluate the result"], correct: 1 },
          { question: "What does the second step involve?", options: ["Writing solutions", "Taking action", "Analysing the causes", "Evaluating results"], correct: 2 },
          { question: "What does Wind Plus teach students?", options: ["How to avoid problems", "How to use English to communicate solutions", "Grammar rules only", "How to programme computers"], correct: 1 },
          { question: "What should you NOT do when facing a problem?", options: ["Stay calm", "Think carefully", "Panic", "Analyse causes"], correct: 2 },
        ],
      },
      listening: {
        title: "The Team Problem",
        transcript: `Good morning team! We have a problem. Our project deadline is next Friday, but we are behind schedule. We need to find a solution today. First, don't panic. Let's analyse the situation. We need more time for the design part. I suggest we divide the work into smaller tasks. Assign each task to one person. Use a shared calendar to track progress. Work together and communicate every day. If you have a problem, tell the team immediately. Don't wait! Remember: a problem shared is a problem halved. Let's improve our communication and work smarter. I believe in this team. We can do this!`,
        questions: [
          { question: "What is the problem the team is facing?", options: ["Budget is too low", "They are behind schedule", "Team members are sick", "The client changed the project"], correct: 1 },
          { question: "What does the speaker suggest?", options: ["Cancel the project", "Work overtime every night", "Divide work into smaller tasks", "Ask for more people"], correct: 2 },
          { question: "What tool does the speaker suggest using?", options: ["Email only", "Phone calls", "A shared calendar", "Printed documents"], correct: 2 },
          { question: "What does 'a problem shared is a problem halved' mean?", options: ["Problems are smaller than they seem", "Talking about problems helps solve them", "Problems disappear on their own", "Only leaders should know about problems"], correct: 1 },
        ],
      },
      speaking: {
        prompt: "Describe a problem you faced and the solution you found. Use 'need' and imperative verbs.",
        tips: [
          "Use: I needed to / We needed to",
          "Use imperatives to give advice: Analyse / Stay calm / Don't wait",
          "Describe: the problem → the solution → the result",
          "End with what you learned",
        ],
        model: "Last week, I had a problem at work. My presentation was not ready and I needed to present the next morning. I needed to stay calm and think. I analysed what was missing. I divided the work into small tasks. I worked for 2 hours and finished everything. The presentation was a success! I learned: don't leave work for the last minute. Analyse, plan, and act!",
      },
      writing: {
        prompt: "Write a Problem & Solution Card. Describe a real or imaginary problem and propose a step-by-step solution.",
        tips: [
          "Use: The problem is... / We need to...",
          "Use imperatives for solutions: Analyse / Improve / Act",
          "Include at least 3 solution steps",
          "End with the expected positive result",
        ],
        model: "Problem: Many students in Brazil don't speak English, which limits their job opportunities.\n\nSolution:\n1. Identify the need — students need accessible and affordable English education.\n2. Don't wait — start learning today, even 15 minutes a day helps.\n3. Use apps and platforms like Wind Plus to practise every day.\n4. Speak, write, and don't be afraid of mistakes — practise makes perfect.\n5. Improve step by step — celebrate every small victory.\n\nExpected Result: More students will have access to global opportunities. Together, we can solve this problem!",
        minWords: 70,
      },
      game: {
        type: "order",
        title: "Problem-Solving Steps",
        instructions: "Put the problem-solving steps in the correct order.",
        items: [
          { question: "Step 1", answer: "Identify the problem" },
          { question: "Step 2", answer: "Analyse the causes" },
          { question: "Step 3", answer: "Think of solutions" },
          { question: "Step 4", answer: "Choose the best solution" },
          { question: "Step 5", answer: "Take action" },
          { question: "Step 6", answer: "Evaluate the result" },
        ],
      },
    },
  },
  {
    id: "a1-09",
    order: 9,
    title: "Communication Respectfully",
    theme: "NVC",
    wefSkill: "NVC (Non-violent communication)",
    communicativeFunction: "Pedir ajuda",
    grammarCore: "Can you...?",
    finalProduct: "Polite Dialogue",
    xpReward: 120,
    durationMin: 20,
    content: {
      vocabulary: {
        words: [
          { word: "please", translation: "por favor", example: "Can you help me, please?", phonetic: "/pliːz/" },
          { word: "thank you", translation: "obrigado(a)", example: "Thank you for your help!", phonetic: "/θæŋk juː/" },
          { word: "excuse me", translation: "com licença", example: "Excuse me, can you repeat that?", phonetic: "/ɪkˈskjuːz miː/" },
          { word: "polite", translation: "educado(a)", example: "It is important to be polite.", phonetic: "/pəˈlaɪt/" },
          { word: "request", translation: "pedido", example: "Can you make this request politely?", phonetic: "/rɪˈkwest/" },
          { word: "repeat", translation: "repetir", example: "Can you repeat that, please?", phonetic: "/rɪˈpiːt/" },
          { word: "understand", translation: "entender", example: "I don't understand. Can you explain?", phonetic: "/ˌʌndəˈstænd/" },
          { word: "help", translation: "ajuda/ajudar", example: "Can you help me with this?", phonetic: "/help/" },
        ],
      },
      reading: {
        title: "The Art of Asking for Help",
        text: `Asking for help is a sign of intelligence, not weakness. In English, polite requests use "Can you...?" or "Could you...?" These are simple but powerful phrases. At work, you can say: "Can you help me with this report?" or "Can you explain this again, please?" In a shop: "Excuse me, can you show me this product?" In class: "Can you repeat the question, please?" Non-violent communication (NVC) teaches us to express our needs clearly and respectfully. Don't say: "You never help me!" Say instead: "Can you help me? I really need your support." Small changes in language can make big differences in relationships. Be polite, be clear, and be kind.`,
        questions: [
          { question: "What phrases are used for polite requests in English?", options: ["Give me / Take this", "Can you / Could you", "Do it / Make it", "I want / I need"], correct: 1 },
          { question: "What does NVC teach us?", options: ["To be aggressive", "To avoid communication", "To express needs clearly and respectfully", "To never ask for help"], correct: 2 },
          { question: "What is the polite version of 'You never help me'?", options: ["Help me now!", "Can you help me? I need your support.", "Why don't you help?", "You should help me."], correct: 1 },
          { question: "What can small changes in language affect?", options: ["Nothing", "Your grades only", "Relationships", "Your appearance"], correct: 2 },
        ],
      },
      listening: {
        title: "A Polite Conversation",
        transcript: `Receptionist: Good morning! Can I help you?\nVisitor: Good morning! Yes, please. I have an appointment with Ms. Costa at 10 am.\nReceptionist: Of course! Can you give me your name, please?\nVisitor: My name is Pedro Silva.\nReceptionist: Thank you, Mr. Silva. Can you wait here for a moment?\nVisitor: Of course. Excuse me, can you tell me where the bathroom is?\nReceptionist: Certainly! It's on the right, near the elevator.\nVisitor: Thank you very much!\nReceptionist: You're welcome. Ms. Costa will be with you shortly.\nVisitor: Perfect. Can you let her know I'm here?\nReceptionist: Absolutely! Have a seat, please.`,
        questions: [
          { question: "Why is Pedro at the reception?", options: ["For a job interview", "He has an appointment with Ms. Costa", "He works there", "He is lost"], correct: 1 },
          { question: "What does the receptionist ask Pedro first?", options: ["His appointment time", "His phone number", "His name", "His company"], correct: 2 },
          { question: "Where is the bathroom?", options: ["On the left, near the stairs", "On the right, near the elevator", "On the second floor", "Near the exit"], correct: 1 },
          { question: "What does Pedro ask the receptionist to do at the end?", options: ["Show him to the meeting room", "Call a taxi", "Let Ms. Costa know he's there", "Get him a coffee"], correct: 2 },
        ],
      },
      speaking: {
        prompt: "Practice asking for help politely. Use 'Can you...?' in 3 different situations: at work, in class, and in a public place.",
        tips: [
          "Start with: 'Excuse me...' or 'Hello...'",
          "Use: Can you + verb + please?",
          "Be specific about what you need",
          "Always say 'thank you' at the end",
        ],
        model: "Situation 1 (at work): 'Excuse me, can you help me with this presentation, please? I don't understand this part. Thank you!'\nSituation 2 (in class): 'Excuse me, can you repeat the question, please? I didn't understand. Thank you!'\nSituation 3 (in public): 'Excuse me, can you tell me where the nearest bus stop is, please? Thank you very much!'",
      },
      writing: {
        prompt: "Write a Polite Dialogue in English. Create a conversation where someone asks for help in 3 different situations.",
        tips: [
          "Use: Can you...? / Could you...?",
          "Include: Excuse me / Please / Thank you",
          "Write at least 6 lines of dialogue",
          "Make it realistic and natural",
        ],
        model: "At work:\nA: Excuse me, can you help me with this report?\nB: Of course! What do you need?\nA: Can you check my data, please? I'm not sure it's correct.\nB: Sure! I'll look at it now.\nA: Thank you so much!\n\nIn class:\nStudent: Excuse me, can you repeat the exercise, please?\nTeacher: Certainly! Can you open your book to page 24?\nStudent: Thank you, teacher!",
        minWords: 70,
      },
      game: {
        type: "fill",
        title: "Polite or Not Polite?",
        instructions: "Rewrite each rude sentence into a polite request using 'Can you...?'.",
        items: [
          { question: "Give me the pen!", answer: "Can you give me the pen, please?" },
          { question: "Explain this again!", answer: "Can you explain this again, please?" },
          { question: "Move your bag!", answer: "Can you move your bag, please?" },
          { question: "Help me!", answer: "Can you help me, please?" },
          { question: "Repeat that!", answer: "Can you repeat that, please?" },
        ],
      },
    },
  },
  {
    id: "a1-10",
    order: 10,
    title: "My First Pitch",
    theme: "Creative thinking",
    wefSkill: "Creative thinking",
    communicativeFunction: "Apresentar ideia",
    grammarCore: "review + connectors",
    finalProduct: "Mini Pitch",
    xpReward: 150,
    durationMin: 25,
    content: {
      vocabulary: {
        words: [
          { word: "idea", translation: "ideia", example: "My idea is to create an app.", phonetic: "/aɪˈdɪə/" },
          { word: "pitch", translation: "apresentação de ideia", example: "I need to prepare my pitch.", phonetic: "/pɪtʃ/" },
          { word: "because", translation: "porque", example: "I like this idea because it helps people.", phonetic: "/bɪˈkɒz/" },
          { word: "however", translation: "no entanto", example: "It's expensive, however it works.", phonetic: "/haʊˈevər/" },
          { word: "firstly", translation: "primeiramente", example: "Firstly, let me explain the problem.", phonetic: "/ˈfɜːstli/" },
          { word: "finally", translation: "finalmente", example: "Finally, here is my solution.", phonetic: "/ˈfaɪnəli/" },
          { word: "believe", translation: "acreditar", example: "I believe this idea can work.", phonetic: "/bɪˈliːv/" },
          { word: "impact", translation: "impacto", example: "This has a positive impact on people.", phonetic: "/ˈɪmpækt/" },
        ],
      },
      reading: {
        title: "The Power of a Good Pitch",
        text: `A pitch is a short, clear presentation of an idea. Good pitches use connectors like 'firstly', 'however', 'because', and 'finally' to organise ideas. The best pitches have three parts: the problem, the solution, and the impact. Firstly, present the problem clearly. Why is it important? Then, describe your solution. How does it work? However, the most powerful part is the impact. What changes because of your idea? Finally, end with a call to action. A great pitch is confident and enthusiastic. Use simple language and strong verbs. I believe that everyone has a great idea inside them. The key is to communicate it well. In English, you can share your ideas with the world!`,
        questions: [
          { question: "What are the three parts of a good pitch?", options: ["Introduction, body, conclusion", "Problem, solution, impact", "Data, graphs, examples", "Greeting, story, farewell"], correct: 1 },
          { question: "What is the 'most powerful part' of a pitch?", options: ["The problem", "The solution", "The impact", "The introduction"], correct: 2 },
          { question: "What should a great pitch be?", options: ["Long and detailed", "Complicated and technical", "Confident and enthusiastic", "Formal and academic"], correct: 2 },
          { question: "According to the text, what is the key to sharing your idea?", options: ["Having money", "Knowing the right people", "Communicating it well", "Using complicated language"], correct: 2 },
        ],
      },
      listening: {
        title: "A Mini Pitch",
        transcript: `Good morning everyone! My name is Camila and I have an idea I want to share. Firstly, let me tell you about the problem. Many young Brazilians want to improve their English but they don't have time or money for traditional courses. This is a big problem because English limits their opportunities. However, I have a solution. My idea is a micro-learning app called WindLearn. It teaches English in 15-minute sessions, every day. Because it is mobile, students can learn anywhere. Finally, the impact: in 6 months, users improve their English by 40%. I believe this app can change lives. I am confident it will work. Thank you for listening. I am ready for your questions!`,
        questions: [
          { question: "What problem does Camila describe?", options: ["Lack of good teachers", "No internet access", "Young Brazilians want to learn English but lack time/money", "Bad quality English content"], correct: 2 },
          { question: "What is the name of Camila's idea?", options: ["WindPlus", "EasyEnglish", "WindLearn", "QuickLearn"], correct: 2 },
          { question: "How long are the learning sessions?", options: ["5 minutes", "10 minutes", "15 minutes", "30 minutes"], correct: 2 },
          { question: "What is the expected impact after 6 months?", options: ["Users become fluent", "Users improve by 40%", "Users get jobs abroad", "Users save money"], correct: 1 },
        ],
      },
      speaking: {
        prompt: "Present your Mini Pitch! Choose an idea (app, product, service, or project) and pitch it in English using connectors.",
        tips: [
          "Use: Firstly / Then / However / Finally",
          "Structure: Problem → Solution → Impact",
          "Speak with confidence and enthusiasm",
          "End with: 'I believe this idea can...' or 'Thank you for listening!'",
        ],
        model: "Good morning! My name is [Name] and I have an idea. Firstly, the problem: many people in Brazil need English but traditional courses are too expensive. However, my solution is a free daily micro-learning platform. It teaches English in 10-minute lessons using real-life situations. Finally, the impact: students improve their confidence and open doors to global opportunities. I believe that education should be for everyone. Thank you!",
      },
      writing: {
        prompt: "Write your Mini Pitch! Present your idea using connectors (firstly, however, because, finally) and all the grammar from A1.",
        tips: [
          "Use connectors: Firstly / Then / However / Because / Finally",
          "Structure: Problem → Solution → Impact",
          "Use grammar from A1: verb to be, simple present, there is/are, can, want to",
          "End with a strong closing statement",
        ],
        model: "My Mini Pitch: WindCommunity\n\nGood morning! My name is [Name] and I want to present an idea. Firstly, the problem: there are many professionals in Brazil who want to work internationally, however their English is not confident enough.\n\nMy solution is WindCommunity — a weekly online conversation club. It is free and there are 6 people in each group. I want to use real topics like technology, health, and business. Members can practise speaking, writing, and listening.\n\nFinally, the impact: because members practise every week, they become more confident. They can use English at work and access global opportunities.\n\nI believe that communication is the key to the future. Thank you!",
        minWords: 100,
      },
      game: {
        type: "order",
        title: "Build Your Pitch",
        instructions: "Put the pitch elements in the correct order.",
        items: [
          { question: "Part 1", answer: "Introduce yourself: 'My name is...'" },
          { question: "Part 2", answer: "Present the problem: 'Firstly, the problem is...'" },
          { question: "Part 3", answer: "Describe the solution: 'However, my solution is...'" },
          { question: "Part 4", answer: "Share the impact: 'Finally, because of this...'" },
          { question: "Part 5", answer: "Strong closing: 'I believe... Thank you!'" },
        ],
      },
    },
  },
];
