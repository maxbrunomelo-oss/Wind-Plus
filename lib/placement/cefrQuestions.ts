export type CefrLevel = "starter" | "A1" | "A2" | "B1" | "B2" | "C1";

export type PlacementQuestion = {
  id: string;
  cefrLevel: CefrLevel;
  skill: "vocabulary" | "grammar" | "reading" | "functional" | "discourse";
  prompt: string;
  context?: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  points: number;
};

export const placementQuestions: PlacementQuestion[] = [
  // ─── STARTER / PRE-A1 (5 questions × 1pt = 5pts) ───────────────────────────
  {
    id: "starter-vocab-001",
    cefrLevel: "starter",
    skill: "vocabulary",
    prompt: "What is this? 🐱",
    options: [
      { id: "a", text: "A dog" },
      { id: "b", text: "A cat" },
      { id: "c", text: "A bird" },
      { id: "d", text: "A fish" },
    ],
    correctOptionId: "b",
    explanation: "The emoji shows a cat.",
    points: 1,
  },
  {
    id: "starter-vocab-002",
    cefrLevel: "starter",
    skill: "vocabulary",
    prompt: "Choose the colour: 🔵",
    options: [
      { id: "a", text: "Red" },
      { id: "b", text: "Green" },
      { id: "c", text: "Blue" },
      { id: "d", text: "Yellow" },
    ],
    correctOptionId: "c",
    explanation: "The circle is blue.",
    points: 1,
  },
  {
    id: "starter-grammar-001",
    cefrLevel: "starter",
    skill: "grammar",
    prompt: "My name ___ Carlos.",
    options: [
      { id: "a", text: "am" },
      { id: "b", text: "is" },
      { id: "c", text: "are" },
      { id: "d", text: "be" },
    ],
    correctOptionId: "b",
    explanation: "With 'my name' (third person singular) we use 'is'.",
    points: 1,
  },
  {
    id: "starter-functional-001",
    cefrLevel: "starter",
    skill: "functional",
    prompt: "Someone says 'Hello!' to you. What do you say?",
    options: [
      { id: "a", text: "Goodbye!" },
      { id: "b", text: "Thank you!" },
      { id: "c", text: "Hello!" },
      { id: "d", text: "Sorry!" },
    ],
    correctOptionId: "c",
    explanation: "The natural response to a greeting is to greet back.",
    points: 1,
  },
  {
    id: "starter-vocab-003",
    cefrLevel: "starter",
    skill: "vocabulary",
    prompt: "What number comes after 'two'?",
    options: [
      { id: "a", text: "One" },
      { id: "b", text: "Four" },
      { id: "c", text: "Three" },
      { id: "d", text: "Five" },
    ],
    correctOptionId: "c",
    explanation: "The sequence is: one, two, three.",
    points: 1,
  },

  // ─── A1 (8 questions × 1pt = 8pts) ─────────────────────────────────────────
  {
    id: "a1-grammar-001",
    cefrLevel: "A1",
    skill: "grammar",
    prompt: "She ___ from Brazil.",
    options: [
      { id: "a", text: "am" },
      { id: "b", text: "is" },
      { id: "c", text: "are" },
      { id: "d", text: "be" },
    ],
    correctOptionId: "b",
    explanation: "Use 'is' with she/he/it in the present simple of 'to be'.",
    points: 1,
  },
  {
    id: "a1-grammar-002",
    cefrLevel: "A1",
    skill: "grammar",
    prompt: "They ___ students.",
    options: [
      { id: "a", text: "is" },
      { id: "b", text: "am" },
      { id: "c", text: "are" },
      { id: "d", text: "be" },
    ],
    correctOptionId: "c",
    explanation: "Use 'are' with plural subjects (they/we/you).",
    points: 1,
  },
  {
    id: "a1-vocab-001",
    cefrLevel: "A1",
    skill: "vocabulary",
    prompt: "Which word means the opposite of 'big'?",
    options: [
      { id: "a", text: "Tall" },
      { id: "b", text: "Small" },
      { id: "c", text: "Fast" },
      { id: "d", text: "Heavy" },
    ],
    correctOptionId: "b",
    explanation: "The opposite of 'big' is 'small'.",
    points: 1,
  },
  {
    id: "a1-functional-001",
    cefrLevel: "A1",
    skill: "functional",
    prompt: "You want to know someone's name. What do you ask?",
    options: [
      { id: "a", text: "How old are you?" },
      { id: "b", text: "Where are you from?" },
      { id: "c", text: "How are you today?" },
      { id: "d", text: "What is your name?" },
    ],
    correctOptionId: "d",
    explanation: "'What is your name?' is the standard way to ask someone's name.",
    points: 1,
  },
  {
    id: "a1-grammar-003",
    cefrLevel: "A1",
    skill: "grammar",
    prompt: "I ___ a teacher. I work at a school.",
    options: [
      { id: "a", text: "am" },
      { id: "b", text: "is" },
      { id: "c", text: "are" },
      { id: "d", text: "have" },
    ],
    correctOptionId: "a",
    explanation: "Use 'am' with the subject 'I'.",
    points: 1,
  },
  {
    id: "a1-vocab-002",
    cefrLevel: "A1",
    skill: "vocabulary",
    prompt: "Which word describes a day with a lot of sun?",
    options: [
      { id: "a", text: "Rainy" },
      { id: "b", text: "Cloudy" },
      { id: "c", text: "Sunny" },
      { id: "d", text: "Windy" },
    ],
    correctOptionId: "c",
    explanation: "'Sunny' describes a day with a lot of sunshine.",
    points: 1,
  },
  {
    id: "a1-grammar-004",
    cefrLevel: "A1",
    skill: "grammar",
    prompt: "There ___ two books on the table.",
    options: [
      { id: "a", text: "is" },
      { id: "b", text: "are" },
      { id: "c", text: "am" },
      { id: "d", text: "has" },
    ],
    correctOptionId: "b",
    explanation: "'There are' is used with plural nouns.",
    points: 1,
  },
  {
    id: "a1-functional-002",
    cefrLevel: "A1",
    skill: "functional",
    context: "You don't understand what someone says.",
    prompt: "What do you say?",
    options: [
      { id: "a", text: "That's very interesting, thank you." },
      { id: "b", text: "I know what you mean, of course." },
      { id: "c", text: "Sorry, can you repeat that, please?" },
      { id: "d", text: "Don't worry about it at all." },
    ],
    correctOptionId: "c",
    explanation: "Asking someone to repeat is the correct functional response when you don't understand.",
    points: 1,
  },

  // ─── A2 (8 questions × 2pts = 16pts) ────────────────────────────────────────
  {
    id: "a2-functional-001",
    cefrLevel: "A2",
    skill: "functional",
    context: "You are at a restaurant and want to ask for the menu.",
    prompt: "Which sentence is the most appropriate?",
    options: [
      { id: "a", text: "Bring me the menu over here." },
      { id: "b", text: "Could I see the menu, please?" },
      { id: "c", text: "Can you give me something to eat?" },
      { id: "d", text: "Where is the menu for today?" },
    ],
    correctOptionId: "b",
    explanation: "This is a polite and natural way to ask for the menu.",
    points: 2,
  },
  {
    id: "a2-grammar-001",
    cefrLevel: "A2",
    skill: "grammar",
    prompt: "Yesterday, I ___ to the supermarket after work.",
    options: [
      { id: "a", text: "go" },
      { id: "b", text: "goes" },
      { id: "c", text: "went" },
      { id: "d", text: "going" },
    ],
    correctOptionId: "c",
    explanation: "'Went' is the past simple of 'go', used for completed past actions.",
    points: 2,
  },
  {
    id: "a2-vocab-001",
    cefrLevel: "A2",
    skill: "vocabulary",
    context: "Ana works from 9 am to 6 pm every day.",
    prompt: "What does Ana have?",
    options: [
      { id: "a", text: "A vacation" },
      { id: "b", text: "A schedule" },
      { id: "c", text: "A problem" },
      { id: "d", text: "A hobby" },
    ],
    correctOptionId: "b",
    explanation: "Working fixed hours every day describes having a schedule or routine.",
    points: 2,
  },
  {
    id: "a2-grammar-002",
    cefrLevel: "A2",
    skill: "grammar",
    prompt: "She usually ___ coffee in the morning, but today she ___ tea.",
    options: [
      { id: "a", text: "drinks / drink" },
      { id: "b", text: "drinks / is drinking" },
      { id: "c", text: "drink / drinks" },
      { id: "d", text: "is drinking / drinks" },
    ],
    correctOptionId: "b",
    explanation: "Present simple for habits ('usually drinks') and present continuous for actions happening now ('is drinking').",
    points: 2,
  },
  {
    id: "a2-functional-002",
    cefrLevel: "A2",
    skill: "functional",
    context: "You meet a colleague you haven't seen for a while.",
    prompt: "Which is the most natural opener?",
    options: [
      { id: "a", text: "Good to see you — how's everything going?" },
      { id: "b", text: "Oh, what brings you here today then?" },
      { id: "c", text: "I don't really remember who you are." },
      { id: "d", text: "Long time no see! How have you been?" },
    ],
    correctOptionId: "d",
    explanation: "'Long time no see!' is a natural, friendly expression for someone you haven't seen for a while.",
    points: 2,
  },
  {
    id: "a2-reading-001",
    cefrLevel: "A2",
    skill: "reading",
    context: "The library is open Monday to Friday, from 8 am to 8 pm. On Saturdays, it closes at 5 pm. It is closed on Sundays.",
    prompt: "On which day is the library closed all day?",
    options: [
      { id: "a", text: "Monday" },
      { id: "b", text: "Saturday" },
      { id: "c", text: "Friday" },
      { id: "d", text: "Sunday" },
    ],
    correctOptionId: "d",
    explanation: "The text explicitly states the library is closed on Sundays.",
    points: 2,
  },
  {
    id: "a2-grammar-003",
    cefrLevel: "A2",
    skill: "grammar",
    prompt: "This is ___ interesting book I've ever read.",
    options: [
      { id: "a", text: "a more" },
      { id: "b", text: "the most" },
      { id: "c", text: "most" },
      { id: "d", text: "the more" },
    ],
    correctOptionId: "b",
    explanation: "Superlatives use 'the most + adjective' (or 'the + adjective + est').",
    points: 2,
  },
  {
    id: "a2-vocab-002",
    cefrLevel: "A2",
    skill: "vocabulary",
    prompt: "Which word best completes the sentence? 'She felt ___ after the long meeting.'",
    options: [
      { id: "a", text: "excited" },
      { id: "b", text: "exhausted" },
      { id: "c", text: "surprised" },
      { id: "d", text: "confused" },
    ],
    correctOptionId: "b",
    explanation: "'Exhausted' means very tired, which is natural after a long meeting.",
    points: 2,
  },

  // ─── B1 (9 questions × 3pts = 27pts) ────────────────────────────────────────
  {
    id: "b1-reading-001",
    cefrLevel: "B1",
    skill: "reading",
    context:
      "Maya has been studying English for two years. She can understand most conversations at work, but she still feels nervous when she needs to speak in meetings.",
    prompt: "What is Maya's main difficulty?",
    options: [
      { id: "a", text: "She struggles to follow conversations at work." },
      { id: "b", text: "She has studied English for less than a year." },
      { id: "c", text: "She prefers reading English rather than speaking it." },
      { id: "d", text: "She feels insecure when speaking in professional situations." },
    ],
    correctOptionId: "d",
    explanation:
      "The text says she understands most conversations but feels nervous when speaking in meetings.",
    points: 3,
  },
  {
    id: "b1-grammar-001",
    cefrLevel: "B1",
    skill: "grammar",
    prompt: "By the time we arrived, the presentation ___ already ___.",
    options: [
      { id: "a", text: "had / started" },
      { id: "b", text: "has / started" },
      { id: "c", text: "was / starting" },
      { id: "d", text: "have / started" },
    ],
    correctOptionId: "a",
    explanation:
      "Past perfect ('had started') is used for an action completed before another past moment.",
    points: 3,
  },
  {
    id: "b1-vocab-001",
    cefrLevel: "B1",
    skill: "vocabulary",
    context:
      "The manager asked the team to submit their reports by Friday without fail.",
    prompt: "What does 'without fail' mean in this context?",
    options: [
      { id: "a", text: "With maximum effort and dedication" },
      { id: "b", text: "Whenever they feel ready to do so" },
      { id: "c", text: "Before anyone else gets the chance" },
      { id: "d", text: "Certainly and without exception" },
    ],
    correctOptionId: "d",
    explanation: "'Without fail' is a fixed expression meaning 'definitely, without exception'.",
    points: 3,
  },
  {
    id: "b1-functional-001",
    cefrLevel: "B1",
    skill: "functional",
    context:
      "You disagree with a colleague's idea in a work meeting, but you want to be polite.",
    prompt: "Which response is the most professionally appropriate?",
    options: [
      { id: "a", text: "That's completely wrong and my idea is far better." },
      { id: "b", text: "I really don't have any strong opinion on this matter." },
      { id: "c", text: "I see your point, but have you considered another approach?" },
      { id: "d", text: "Maybe we should just ask someone else to decide." },
    ],
    correctOptionId: "c",
    explanation:
      "Acknowledging the other person's view before presenting your perspective is professional and diplomatic.",
    points: 3,
  },
  {
    id: "b1-grammar-002",
    cefrLevel: "B1",
    skill: "grammar",
    prompt: "If I ___ more time, I ___ learn a new language.",
    options: [
      { id: "a", text: "had / would" },
      { id: "b", text: "have / will" },
      { id: "c", text: "would have / will" },
      { id: "d", text: "have / would" },
    ],
    correctOptionId: "a",
    explanation:
      "Second conditional (hypothetical): 'If + past simple, would + base verb'.",
    points: 3,
  },
  {
    id: "b1-reading-002",
    cefrLevel: "B1",
    skill: "reading",
    context:
      "Remote working became widespread during the pandemic. While many employees welcomed the flexibility, companies noticed that collaboration and communication sometimes suffered. Some organisations adopted a hybrid model to balance both needs.",
    prompt: "What was the main advantage of remote working mentioned in the text?",
    options: [
      { id: "a", text: "Better communication between teams" },
      { id: "b", text: "Lower costs for companies" },
      { id: "c", text: "Flexibility for employees" },
      { id: "d", text: "Faster productivity overall" },
    ],
    correctOptionId: "c",
    explanation:
      "The text says employees 'welcomed the flexibility' of remote working.",
    points: 3,
  },
  {
    id: "b1-vocab-002",
    cefrLevel: "B1",
    skill: "vocabulary",
    prompt: "Which word is closest in meaning to 'enhance'?",
    options: [
      { id: "a", text: "Reduce" },
      { id: "b", text: "Replace" },
      { id: "c", text: "Improve" },
      { id: "d", text: "Ignore" },
    ],
    correctOptionId: "c",
    explanation: "'Enhance' means to improve or increase the quality of something.",
    points: 3,
  },
  {
    id: "b1-grammar-003",
    cefrLevel: "B1",
    skill: "grammar",
    prompt: "The report ___ before the deadline, so the team felt relieved.",
    options: [
      { id: "a", text: "was still finishing" },
      { id: "b", text: "has been finished" },
      { id: "c", text: "had been finished" },
      { id: "d", text: "was being finished" },
    ],
    correctOptionId: "c",
    explanation:
      "Past perfect passive ('had been finished') shows a completed action before another past event.",
    points: 3,
  },
  {
    id: "b1-discourse-001",
    cefrLevel: "B1",
    skill: "discourse",
    prompt:
      "Which word best connects these two ideas? 'She studied hard all semester. ___, she passed the exam with distinction.'",
    options: [
      { id: "a", text: "However" },
      { id: "b", text: "Although" },
      { id: "c", text: "As a result" },
      { id: "d", text: "On the other hand" },
    ],
    correctOptionId: "c",
    explanation:
      "'As a result' introduces a consequence, connecting cause (studied hard) and effect (passed with distinction).",
    points: 3,
  },

  // ─── B2 (9 questions × 4pts = 36pts) ────────────────────────────────────────
  {
    id: "b2-discourse-001",
    cefrLevel: "B2",
    skill: "discourse",
    context:
      "Although remote work offers flexibility, it also requires strong self-management and communication skills.",
    prompt: "Which sentence best expresses the same idea?",
    options: [
      { id: "a", text: "Remote work is simple, as it only means staying at home." },
      { id: "b", text: "Remote work significantly reduces any need for communication." },
      { id: "c", text: "Remote work can be flexible, but it demands discipline and clear communication." },
      { id: "d", text: "Remote work is not feasible without direct managerial oversight." },
    ],
    correctOptionId: "c",
    explanation:
      "Option C preserves the contrast introduced by 'although' and the meaning of the original sentence.",
    points: 4,
  },
  {
    id: "b2-grammar-001",
    cefrLevel: "B2",
    skill: "grammar",
    prompt: "Had she arrived earlier, she ___ the beginning of the presentation.",
    options: [
      { id: "a", text: "would have caught" },
      { id: "b", text: "was going to catch" },
      { id: "c", text: "will have caught" },
      { id: "d", text: "had been catching" },
    ],
    correctOptionId: "a",
    explanation:
      "Third conditional (inverted): 'Had + subject + past participle, would have + past participle'.",
    points: 4,
  },
  {
    id: "b2-vocab-001",
    cefrLevel: "B2",
    skill: "vocabulary",
    context:
      "The company's decision was met with widespread criticism from employees and shareholders alike.",
    prompt: "What does 'widespread' mean here?",
    options: [
      { id: "a", text: "Limited to a very specific group or location" },
      { id: "b", text: "Affecting only a handful of individuals" },
      { id: "c", text: "Temporary in nature and unlikely to last" },
      { id: "d", text: "Found across many people, places, or areas" },
    ],
    correctOptionId: "d",
    explanation:
      "'Widespread' means affecting or involving a large number of people or a large area.",
    points: 4,
  },
  {
    id: "b2-reading-001",
    cefrLevel: "B2",
    skill: "reading",
    context:
      "The rise of subscription-based services has fundamentally altered consumer behaviour. Rather than owning products, people increasingly prefer access over ownership — a shift driven by convenience, cost, and environmental awareness.",
    prompt: "According to the text, what drives the preference for access over ownership?",
    options: [
      { id: "a", text: "Stricter government policies on product ownership" },
      { id: "b", text: "The growing preference for owning many products" },
      { id: "c", text: "Convenience, cost-effectiveness, and environmental concerns" },
      { id: "d", text: "The superior quality of subscription-based services" },
    ],
    correctOptionId: "c",
    explanation:
      "The text explicitly lists 'convenience, cost, and environmental awareness' as the drivers.",
    points: 4,
  },
  {
    id: "b2-grammar-002",
    cefrLevel: "B2",
    skill: "grammar",
    prompt: "It is high time the government ___ action on climate change.",
    options: [
      { id: "a", text: "takes" },
      { id: "b", text: "take" },
      { id: "c", text: "took" },
      { id: "d", text: "has taken" },
    ],
    correctOptionId: "c",
    explanation:
      "'It is high time + past simple' expresses urgency — the action is overdue.",
    points: 4,
  },
  {
    id: "b2-discourse-002",
    cefrLevel: "B2",
    skill: "discourse",
    prompt:
      "Choose the sentence that correctly uses a concessive clause: ",
    options: [
      { id: "a", text: "Despite of the rain, we enjoyed the picnic." },
      { id: "b", text: "Although we were tired, but we continued working." },
      { id: "c", text: "Despite the rain, we enjoyed the picnic." },
      { id: "d", text: "Even though the rain, we continued." },
    ],
    correctOptionId: "c",
    explanation:
      "'Despite + noun phrase' is correct. 'Despite of' is incorrect; 'although' and 'but' should not appear in the same clause.",
    points: 4,
  },
  {
    id: "b2-vocab-002",
    cefrLevel: "B2",
    skill: "vocabulary",
    prompt: "Which phrasal verb means 'to postpone'?",
    options: [
      { id: "a", text: "Put off" },
      { id: "b", text: "Put out" },
      { id: "c", text: "Put up" },
      { id: "d", text: "Put down" },
    ],
    correctOptionId: "a",
    explanation:
      "'Put off' means to postpone or delay. The others have different meanings.",
    points: 4,
  },
  {
    id: "b2-reading-002",
    cefrLevel: "B2",
    skill: "reading",
    context:
      "Critics argue that social media algorithms are designed not to inform but to engage — prioritising content that provokes emotional reactions over content that is accurate or balanced.",
    prompt: "What is the main criticism expressed in this text?",
    options: [
      { id: "a", text: "Algorithms favour emotionally engaging content over truthful or balanced content." },
      { id: "b", text: "Social media platforms are simply too slow at delivering information." },
      { id: "c", text: "Social media companies are not generating sufficient financial returns." },
      { id: "d", text: "Most users lack the knowledge to navigate social media responsibly." },
    ],
    correctOptionId: "a",
    explanation:
      "The text says algorithms prioritise emotional engagement over accuracy and balance.",
    points: 4,
  },
  {
    id: "b2-functional-001",
    cefrLevel: "B2",
    skill: "functional",
    context:
      "You are negotiating a deadline extension with a client. You need to be assertive but maintain the professional relationship.",
    prompt: "Which response best achieves this?",
    options: [
      { id: "a", text: "We're unable to meet the deadline, and that is our final answer." },
      { id: "b", text: "Please extend the deadline — our team has too many commitments." },
      { id: "c", text: "We would need more time, but understand this may not be ideal. Could we discuss a timeline that works for both sides?" },
      { id: "d", text: "Meeting your deadline is entirely your responsibility, not ours." },
    ],
    correctOptionId: "c",
    explanation:
      "Option C acknowledges the client's perspective, makes a request diplomatically, and proposes a collaborative solution.",
    points: 4,
  },

  // ─── C1 (6 questions × 5pts = 30pts) ────────────────────────────────────────
  {
    id: "c1-reading-001",
    cefrLevel: "C1",
    skill: "reading",
    context:
      "The increasing use of artificial intelligence in education does not merely automate tasks; it reshapes the way institutions define learning, assessment, and human interaction.",
    prompt: "What is implied in the sentence?",
    options: [
      { id: "a", text: "AI is primarily used to speed up administrative tasks." },
      { id: "b", text: "AI may transform deeper educational structures and assumptions." },
      { id: "c", text: "AI has very little meaningful impact on educational outcomes." },
      { id: "d", text: "AI is already prepared to replace human teachers entirely." },
    ],
    correctOptionId: "b",
    explanation:
      "The sentence uses 'not merely… it reshapes' to imply a transformation beyond surface-level automation.",
    points: 5,
  },
  {
    id: "c1-discourse-001",
    cefrLevel: "C1",
    skill: "discourse",
    context:
      "The policy was well-intentioned; nevertheless, its implementation revealed deep structural flaws that undermined its very purpose.",
    prompt: "What rhetorical function does 'nevertheless' serve here?",
    options: [
      { id: "a", text: "It reinforces the positive point made in the prior clause." },
      { id: "b", text: "It restates and summarises the central argument made." },
      { id: "c", text: "It signals a cause leading directly to the described outcome." },
      { id: "d", text: "It introduces a concession contrasting with the prior positive view." },
    ],
    correctOptionId: "d",
    explanation:
      "'Nevertheless' is an adversative connector signalling a contrast between the positive intent and the negative outcome.",
    points: 5,
  },
  {
    id: "c1-vocab-001",
    cefrLevel: "C1",
    skill: "vocabulary",
    context:
      "The scientist's findings were considered seminal in the field, inspiring decades of subsequent research.",
    prompt: "What does 'seminal' mean in this context?",
    options: [
      { id: "a", text: "Foundational, influential, and inspiring future research" },
      { id: "b", text: "Widely disputed and considered highly controversial" },
      { id: "c", text: "Now outdated and largely irrelevant to the field" },
      { id: "d", text: "Technically advanced and difficult to replicate" },
    ],
    correctOptionId: "a",
    explanation:
      "'Seminal' describes something that strongly influences future development — foundational and influential.",
    points: 5,
  },
  {
    id: "c1-grammar-001",
    cefrLevel: "C1",
    skill: "grammar",
    prompt:
      "Not only ___ he fail to submit the report, but he also refused to explain the delay.",
    options: [
      { id: "a", text: "did" },
      { id: "b", text: "had" },
      { id: "c", text: "was" },
      { id: "d", text: "has" },
    ],
    correctOptionId: "a",
    explanation:
      "Fronting 'not only' triggers subject-auxiliary inversion: 'Not only did he fail…'.",
    points: 5,
  },
  {
    id: "c1-discourse-002",
    cefrLevel: "C1",
    skill: "discourse",
    context:
      "While proponents of globalisation emphasise its role in reducing poverty, critics contend that it has exacerbated inequality within nations, even as it has narrowed the gap between them.",
    prompt: "Which best describes the overall argument structure of this sentence?",
    options: [
      { id: "a", text: "It shows globalisation reduces global gaps but may worsen national inequality." },
      { id: "b", text: "It expresses full and unconditional support for globalisation." },
      { id: "c", text: "It presents one clear argument alongside a single counterpoint." },
      { id: "d", text: "It explicitly rejects all criticism directed at globalisation." },
    ],
    correctOptionId: "a",
    explanation:
      "The sentence presents both a benefit (reducing poverty/global gap) and a drawback (internal inequality), creating a nuanced tension.",
    points: 5,
  },
  {
    id: "c1-reading-002",
    cefrLevel: "C1",
    skill: "reading",
    context:
      "Bureaucratic inertia, rather than lack of resources, is often the most insidious obstacle to institutional reform. Organisations may possess both the funding and the political will to change, yet find themselves paralysed by entrenched processes and the cultural resistance of those who benefit from the status quo.",
    prompt: "According to the text, what is the most significant barrier to institutional reform?",
    options: [
      { id: "a", text: "Resistance embedded in organisational culture and processes" },
      { id: "b", text: "Insufficient funding and limited financial resources" },
      { id: "c", text: "Lack of political will among decision-makers" },
      { id: "d", text: "External pressure coming from outside stakeholders" },
    ],
    correctOptionId: "a",
    explanation:
      "The text argues that the real obstacle is 'entrenched processes' and 'cultural resistance', not resources or political will.",
    points: 5,
  },
];

export const writingPrompt = {
  id: "writing-001",
  prompt:
    "Write 5 to 8 lines in English about why you want to improve your English and how it could change your personal, academic or professional life.",
};

export const questionsByLevel: Record<CefrLevel, PlacementQuestion[]> = {
  starter: placementQuestions.filter((q) => q.cefrLevel === "starter"),
  A1: placementQuestions.filter((q) => q.cefrLevel === "A1"),
  A2: placementQuestions.filter((q) => q.cefrLevel === "A2"),
  B1: placementQuestions.filter((q) => q.cefrLevel === "B1"),
  B2: placementQuestions.filter((q) => q.cefrLevel === "B2"),
  C1: placementQuestions.filter((q) => q.cefrLevel === "C1"),
};
