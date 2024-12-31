const readline = require("readline");
const { isNullOrUndefined } = require("util");

class Keyword {
    constructor(word, rank, decomp) {
      this.word = word;
      this.rank = rank;
      this.decomp = decomp;
    }
  }
  
  class Decomp {
    constructor(match, save, reasmb) {
      this.match = match;
      this.save = save;
      this.reasmb = reasmb;
    }
  }
  
  function RuleSet(key, rank, ...rules) {
    return new Keyword(key, rank, rules);
  }
  
  function Rule(match, save, ...reasmb) {
    return new Decomp(match, save, reasmb);
  }
  
  const keywords = [
    RuleSet(
      "sorry",
      0,
      Rule(
        "*",
        false,
        "Please don't apologise.",
        "Apologies are not necessary.",
        "I've told you that apologies are not required.",
        "It did not bother me.  Please continue."
      )
    ),
    RuleSet("apologise", 0, Rule("*", false, "=sorry")),
    RuleSet(
      "remember",
      5,
      Rule(
        "* i remember *",
        false,
        "Do you often think of (2) ?",
        "Does thinking of (2) bring anything else to mind ?",
        "What else do you recollect ?",
        "Why do you remember (2) just now ?",
        "What in the present situation reminds you of (2) ?",
        "What is the connection between me and (2) ?",
        "What else does (2) remind you of ?"
      ),
      Rule(
        "* do you remember *",
        false,
        "Did you think I would forget (2) ?",
        "Why do you think I should recall (2) now ?",
        "What about (2) ?",
        "=what",
        "You mentioned (2) ?"
      ),
      Rule(
        "* you remember *",
        false,
        "How could I forget (2) ?",
        "What about (2) should I remember ?",
        "=you"
      )
    ),
    RuleSet(
      "forget",
      5,
      Rule(
        "* i forget *",
        false,
        "Can you think of why you might forget (2) ?",
        "Why can't you remember (2) ?",
        "How often do you think of (2) ?",
        "Does it bother you to forget that ?",
        "Could it be a mental block ?",
        "Are you generally forgetful ?",
        "Do you think you are suppressing (2) ?"
      ),
      Rule(
        "* did you forget *",
        false,
        "Why do you ask ?",
        "Are you sure you told me ?",
        "Would it bother you if I forgot (2) ?",
        "Why should I recall (2) just now ?",
        "=what",
        "Tell me more about (2)."
      )
    ),
    RuleSet(
      "if",
      3,
      Rule(
        "* if *",
        false,
        "Do you think it's likely that (2) ?",
        "Do you wish that (2) ?",
        "What do you know about (2) ?",
        "Really, if (2) ?",
        "What would you do if (2) ?",
        "But what are the chances that (2) ?",
        "What does this speculation lead to ?"
      )
    ),
    RuleSet(
      "dreamed",
      4,
      Rule(
        "* i dreamed *",
        false,
        "Really, (2) ?",
        "Have you ever fantasized (2) while you were awake ?",
        "Have you ever dreamed (2) before ?",
        "=dream"
      )
    ),
    RuleSet(
      "dream",
      3,
      Rule(
        "*",
        false,
        "What does that dream suggest to you ?",
        "Do you dream often ?",
        "What persons appear in your dreams ?",
        "Do you believe that dreams have something to do with your problem ?"
      )
    ),
    RuleSet(
      "perhaps",
      0,
      Rule(
        "*",
        false,
        "You don't seem quite certain.",
        "Why the uncertain tone ?",
        "Can't you be more positive ?",
        "You aren't sure ?",
        "Don't you know ?",
        "How likely, would you estimate ?"
      )
    ),
    RuleSet(
      "name",
      15,
      Rule(
        "*",
        false,
        "I am not interested in names.",
        "I've told you before, I don't care about names -- please continue."
      )
    ),
    RuleSet(
      "deutsch",
      0,
      Rule(
        "*",
        false,
        "=xforeign",
        "I told you before, I don't understand German."
      )
    ),
    RuleSet(
      "francais",
      0,
      Rule(
        "*",
        false,
        "=xforeign",
        "I told you before, I don't understand French."
      )
    ),
    RuleSet(
      "italiano",
      0,
      Rule(
        "*",
        false,
        "=xforeign",
        "I told you before, I don't understand Italian."
      )
    ),
    RuleSet(
      "espanol",
      0,
      Rule(
        "*",
        false,
        "=xforeign",
        "I told you before, I don't understand Spanish."
      )
    ),
    RuleSet("xforeign", 0, Rule("*", false, "I speak only English.")),
    RuleSet(
      "hello",
      0,
      Rule(
        "*",
        false,
        "How do you do.  Please state your problem.",
        "Hi.  What seems to be your problem ?"
      )
    ),
    RuleSet(
      "computer",
      50,
      Rule(
        "*",
        false,
        "Do computers worry you ?",
        "Why do you mention computers ?",
        "What do you think machines have to do with your problem ?",
        "Don't you think computers can help people ?",
        "What about machines worries you ?",
        "What do you think about machines ?",
        "You don't think I am a computer program, do you ?"
      )
    ),
    RuleSet(
      "am",
      0,
      Rule(
        "* am i *",
        false,
        "Do you believe you are (2) ?",
        "Would you want to be (2) ?",
        "Do you wish I would tell you you are (2) ?",
        "What would it mean if you were (2) ?",
        "=what"
      ),
      Rule("* i am *", false, "=i"),
      Rule("*", false, "Why do you say 'am' ?", "I don't understand that.")
    ),
    RuleSet(
      "are",
      0,
      Rule(
        "* are you *",
        false,
        "Why are you interested in whether I am (2) or not ?",
        "Would you prefer if I weren't (2) ?",
        "Perhaps I am (2) in your fantasies.",
        "Do you sometimes think I am (2) ?",
        "=what",
        "Would it matter to you ?",
        "What if I were (2) ?"
      ),
      Rule("* you are *", false, "=you"),
      Rule(
        "* are *",
        false,
        "Did you think they might not be (2) ?",
        "Would you like it if they were not (2) ?",
        "What if they were not (2) ?",
        "Are they always (2) ?",
        "Possibly they are (2).",
        "Are you positive they are (2) ?"
      )
    ),
    RuleSet(
      "your",
      0,
      Rule(
        "* your *",
        false,
        "Why are you concerned over my (2) ?",
        "What about your own (2) ?",
        "Are you worried about someone else's (2) ?",
        "Really, my (2) ?",
        "What makes you think of my (2) ?",
        "Do you want my (2) ?"
      )
    ),
    RuleSet(
      "was",
      2,
      Rule(
        "* was i *",
        false,
        "What if you were (2) ?",
        "Do you think you were (2) ?",
        "Were you (2) ?",
        "What would it mean if you were (2) ?",
        "What does ' (2) ' suggest to you ?",
        "=what"
      ),
      Rule(
        "* i was *",
        false,
        "Were you really ?",
        "Why do you tell me you were (2) now ?",
        "Perhaps I already know you were (2)."
      ),
      Rule(
        "* was you *",
        false,
        "Would you like to believe I was (2) ?",
        "What suggests that I was (2) ?",
        "What do you think ?",
        "Perhaps I was (2).",
        "What if I had been (2) ?"
      )
    ),
    RuleSet(
      "i",
      0,
      Rule(
        "* i /desire *",
        false,
        "What would it mean to you if you got (3) ?",
        "Why do you want (3) ?",
        "Suppose you got (3) soon.",
        "What if you never got (3) ?",
        "What would getting (3) mean to you ?",
        "What does wanting (3) have to do with this discussion ?"
      ),
      Rule(
        "* i am * /sad *",
        false,
        "I am sorry to hear that you are (3).",
        "Do you think coming here will help you not to be (3) ?",
        "I'm sure it's not pleasant to be (3).",
        "Can you explain what made you (3) ?"
      ),
      Rule(
        "* i am * /happy *",
        false,
        "How have I helped you to be (3) ?",
        "Has your treatment made you (3) ?",
        "What makes you (3) just now ?",
        "Can you explain why you are suddenly (3) ?"
      ),
      Rule("* i was *", false, "=was"),
      Rule(
        "* i /belief i *",
        false,
        "Do you really think so ?",
        "But you are not sure you (3).",
        "Do you really doubt you (3) ?"
      ),
      Rule("* i * /belief *you *", false, "=you"),
      Rule(
        "* i am *",
        false,
        "Is it because you are (2) that you came to me ?",
        "How long have you been (2) ?",
        "Do you believe it is normal to be (2) ?",
        "Do you enjoy being (2) ?",
        "Do you know anyone else who is (2) ?"
      ),
      Rule(
        "* i /cannot *",
        false,
        "How do you know that you can't (3) ?",
        "Have you tried ?",
        "Perhaps you could (3) now.",
        "Do you really want to be able to (3) ?",
        "What if you could (3) ?"
      ),
      Rule(
        "* i don't *",
        false,
        "Don't you really (2) ?",
        "Why don't you (2) ?",
        "Do you wish to be able to (2) ?",
        "Does that trouble you ?"
      ),
      Rule(
        "* i feel *",
        false,
        "Tell me more about such feelings.",
        "Do you often feel (2) ?",
        "Do you enjoy feeling (2) ?",
        "Of what does feeling (2) remind you ?"
      ),
      Rule(
        "* i * you *",
        false,
        "Perhaps in your fantasies we (2) each other.",
        "Do you wish to (2) me ?",
        "You seem to need to (2) me.",
        "Do you (2) anyone else ?"
      ),
      Rule(
        "*",
        false,
        "You say (1) ?",
        "Can you elaborate on that ?",
        "Do you say (1) for some special reason ?",
        "That's quite interesting."
      )
    ),
    RuleSet(
      "you",
      0,
      Rule("* you remind me of *", false, "=alike"),
      Rule(
        "* you are *",
        false,
        "What makes you think I am (2) ?",
        "Does it please you to believe I am (2) ?",
        "Do you sometimes wish you were (2) ?",
        "Perhaps you would like to be (2)."
      ),
      Rule(
        "* you * me *",
        false,
        "Why do you think I (2) you ?",
        "You like to think I (2) you -- don't you ?",
        "What makes you think I (2) you ?",
        "Really, I (2) you ?",
        "Do you wish to believe I (2) you ?",
        "Suppose I did (2) you -- what would that mean ?",
        "Does someone else believe I (2) you ?"
      ),
      Rule(
        "* you *",
        false,
        "We were discussing you -- not me.",
        "Oh, I (2) ?",
        "You're not really talking about me -- are you ?",
        "What are your feelings now ?"
      )
    ),
    RuleSet(
      "yes",
      0,
      Rule(
        "*",
        false,
        "You seem to be quite positive.",
        "You are sure.",
        "I see.",
        "I understand."
      )
    ),
    RuleSet(
      "no",
      0,
      Rule(
        "* no one *",
        false,
        "Are you sure, no one (2) ?",
        "Surely someone (2) .",
        "Can you think of anyone at all ?",
        "Are you thinking of a very special person ?",
        "Who, may I ask ?",
        "You have a particular person in mind, don't you ?",
        "Who do you think you are talking about ?"
      ),
      Rule(
        "*",
        false,
        "Are you saying no just to be negative?",
        "You are being a bit negative.",
        "Why not ?",
        "Why 'no' ?"
      )
    ),
    RuleSet(
      "my",
      2,
      Rule(
        "* my * /family *",
        false,
        "Tell me more about your family.",
        "Your (3) ?",
        "What else comes to your mind when you think of your (3) ?"
      ),
      Rule(
        "* my *",
        true,
        "Lets discuss further why your (2) bothers you ?",
        "Does that have anything to do with your (2) ?",
        "Earlier you said your (2) ?",
        "But your (2) ?"
      ),
      Rule(
        "* my *",
        false,
        "Your (2) ?",
        "Why do you say your (2) ?",
        "Does that suggest anything else which belongs to you ?",
        "Is it important to you that your (2) ?"
      )
    ),
    RuleSet(
      "can",
      0,
      Rule(
        "* can you *",
        false,
        "You believe I can (2) don't you ?",
        "=what",
        "You want me to be able to (2).",
        "Perhaps you would like to be able to (2) yourself."
      ),
      Rule(
        "* can i *",
        false,
        "Whether or not you can (2) depends on you more than on me.",
        "Do you want to be able to (2) ?",
        "Perhaps you don't want to (2).",
        "=what"
      )
    ),
    RuleSet(
      "what",
      0,
      Rule(
        "*",
        false,
        "Why do you ask ?",
        "Does that question interest you ?",
        "What is it you really want to know ?",
        "Are such questions much on your mind ?",
        "What answer would please you most ?",
        "What do you think ?",
        "What comes to mind when you ask that ?",
        "Have you asked such questions before ?",
        "Have you asked anyone else ?"
      )
    ),
    RuleSet("who", 0, Rule("who *", false, "=what")),
    RuleSet("when", 0, Rule("when *", false, "=what")),
    RuleSet("where", 0, Rule("where *", false, "=what")),
    RuleSet("how", 0, Rule("how *", false, "=what")),
    RuleSet(
      "because",
      0,
      Rule(
        "*",
        false,
        "Is that the real reason ?",
        "Don't any other reasons come to mind ?",
        "Does that reason seem to explain anything else ?",
        "What other reasons might there be ?"
      )
    ),
    RuleSet(
      "why",
      0,
      Rule(
        "* why don't you *",
        false,
        "Do you believe I don't (2) ?",
        "Perhaps I will (2) in good time.",
        "Should you (2) yourself ?",
        "You want me to (2) ?",
        "=what"
      ),
      Rule(
        "* why can't i *",
        false,
        "Do you think you should be able to (2) ?",
        "Do you want to be able to (2) ?",
        "Do you believe this will help you to (2) ?",
        "Have you any idea why you can't (2) ?",
        "=what"
      ),
      Rule("*", false, "=what")
    ),
    RuleSet(
      "everyone",
      2,
      Rule(
        "* /everyone *",
        false,
        "Really, (2) ?",
        "Surely not (2).",
        "Can you think of anyone in particular ?",
        "Who, for example?",
        "Are you thinking of a very special person ?",
        "Who, may I ask ?",
        "Someone special perhaps ?",
        "You have a particular person in mind, don't you ?",
        "Who do you think you're talking about ?"
      )
    ),
    RuleSet("everybody", 2, Rule("*", false, "=everyone")),
    RuleSet("nobody", 2, Rule("*", false, "=everyone")),
    RuleSet("noone", 2, Rule("*", false, "=everyone")),
    RuleSet(
      "always",
      1,
      Rule(
        "*",
        false,
        "Can you think of a specific example ?",
        "When ?",
        "What incident are you thinking of ?",
        "Really, always ?"
      )
    ),
    RuleSet(
      "alike",
      10,
      Rule(
        "*",
        false,
        "In what way ?",
        "What resemblence do you see ?",
        "What does that similarity suggest to you ?",
        "What other connections do you see ?",
        "What do you suppose that resemblence means ?",
        "What is the connection, do you suppose ?",
        "Could there really be some connection ?",
        "How ?"
      )
    ),
    RuleSet("like", 10, Rule("* /be * like *", false, "=alike")),
    RuleSet(
      "different",
      0,
      Rule(
        "*",
        false,
        "How is it different ?",
        "What differences do you see ?",
        "What does that difference suggest to you ?",
        "What other distinctions do you see ?",
        "What do you suppose that disparity means ?",
        "Could there be some connection, do you suppose ?",
        "How ?"
      )
    ),
  ];


  const fallback = [
    "I'm not sure I understand you fully.",
    "Please go on.",
    "What does that suggest to you ?",
    "Do you feel strongly about discussing such things ?",
    "That is interesting.  Please continue.",
    "Tell me more about that.",
    "Does talking about this bother you ?",
  ];

  const synonym = {
    be: ["be", "am", "is", "are", "was"],
    belief: ["belief", "feel", "think", "believe", "wish"],
    cannot: ["cannot", "can't"],
    desire: ["desire", "want", "need"],
    everyone: ["everyone", "everybody", "nobody", "noone"],
    family: [
      "family",
      "mother",
      "mom",
      "father",
      "dad",
      "sister",
      "brother",
      "wife",
      "children",
      "child",
    ],
    happy: ["happy", "elated", "glad", "better"],
    sad: ["sad", "unhappy", "depressed", "sick"],
  };

  const preprocessing = {
    dont: "don't",
    cant: "can't",
    wont: "won't",
    recollect: "remember",
    recall: "remember",
    dreamt: "dreamed",
    dreams: "dream",
    maybe: "perhaps",
    certainly: "yes",
    machine: "computer",
    machines: "computer",
    computers: "computer",
    were: "was",
    "you're": "you are",
    "i'm": "i am",
    same: "alike",
    identical: "alike",
    equivalent: "alike",
  };

  const postprocessing = {
    am: "are",
    your: "my",
    me: "you",
    myself: "yourself",
    yourself: "myself",
    i: "you",
    you: "I",
    my: "your",
    "i'm": "you are",
  };

  function checkForSynonyms(pattern) {
    const index = pattern.indexOf("/");
    const patterns = [];
    if (index !== -1) {
        const word = pattern.slice(index + 1).split(" ")[0];
        const synonyms = synonym[word];
        for (const item of synonyms) {
            patterns.push(pattern.replace(`/${word}`, item));
        }
    } else {
        patterns.push(pattern);
    }

    return patterns;
}

function match(phrase, pattern) {

    //check to see if the pattern contains a synonym
    const patterns = checkForSynonyms(pattern);
    const wordPattern = /\b(\w+)\b/g;
    phrase = phrase + " ";
    for (const item of patterns) {
        const expression = item.replace(/\*/g, "(.*)").replace(wordPattern, "($1)");  
        const regex = new RegExp(expression + "$", "si");  
        const matches = phrase.match(regex);
        if (matches) {
            return matches;
        }
    }
    return null;
}

function preprocessInput(input) {
    const words = input.split(" ");
    const processedWords = words.map(word => preprocessing[word] || word);
    return processedWords.join(" ").toLowerCase();
}

function postprocessResponse(input) {
    const words = input.split(" ");
    const processedWords = words.map(word => postprocessing[word] || word);
    return processedWords.join(" ");
}

function respond(input) {
    input = preprocessInput(input);
    for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword.word}\\b`, 'i'); // Create a regex to match the keyword.word as a whole word, case-insensitive
        if (regex.test(input)) {
            // Match rules in order
            for (const rule of keyword.decomp) {
                let matches = match(input, rule.match);
                if (matches) {
                    matches = matches.slice(1);
                    const reasmb = rule.reasmb[Math.floor(Math.random() * rule.reasmb.length)];

                    if (reasmb.startsWith("=")) {
                        const keyword = keywords.find(kw => kw.word === reasmb.slice(1));
                        if (keyword) {
                            const nextReasmb = keyword.reasmb[Math.floor(Math.random() * keyword.reasmb.length)];
                            if (nextReasmb) {
                                return nextReasmb.replace(/\((\d)\)/g, (match, number) => matches[number] || "");
                            }
                            const decomp = keyword.decomp.find(item => item.match === reasmb);
                            if (decomp) {
                                return decomp.reasmb[Math.floor(Math.random() * decomp.reasmb.length)].replace(/\((\d)\)/g, (match, number) => matches[number] || "");
                            }
                        }
                    } else {
                        return reasmb.replace(/\((\d)\)/g, (match, number) => matches[number] || "");
                    }
                }
            }
        }
    }
    return fallback[Math.floor(Math.random() * fallback.length)];
}

function main() {
  keywords.sort((a, b) => a.rank - b.rank);
  console.log("How do you do. Please tell me your problem.");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", (input) => {
    const reply = respond(input);
    if (reply === null || reply === undefined || reply === "") {
      console.log("Goodbye. It was nice talking to you.");
      rl.close();
    } else {
      console.log(reply);
    }
  });
}

main();

