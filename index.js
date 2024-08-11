






// get rpc from https://chainlist.org/chain/1


const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');
const ethUtil = require('ethereumjs-util');
const fs = require('fs');
const { ethers } = require('ethers');  // Correctly import ethers

// Base mnemonic phrase
const baseMnemonic = "knife example toe peanut they multiply album mom oval come";

// Word list to iterate over for positions 11 and 12
const WORDLIST = ['abandon', 'ability', 'able', 'about', 'above', 'abuse', 'account', 
    'achieve', 'acid', 'acquire', 'actor', 'actress', 'adapt', 'address', 'admit', 'adult', 
    'advance', 'aerobic', 'again', 'agent', 'agree', 'ahead', 'airport', 'aisle', 'alarm', 
    'album', 'alcohol', 'alert', 'alien', 'alley', 'allow', 'alone', 'alpha', 'already', 
    'also', 'alter', 'amateur', 'amazing', 'among', 'analyst', 'ancient', 'anger', 'angle', 
    'angry', 'ankle', 'another', 'antenna', 'antique', 'anxiety', 'apart', 'apology', 'apple', 
    'approve', 'april', 'arch', 'area', 'arena', 'argue', 'armed', 'armor', 'army', 'arrange', 
    'arrow', 'artwork', 'assault', 'asset', 'athlete', 'atom', 'attract', 'auction', 'audit', 
    'aunt', 'auto', 'average', 'avocado', 'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 
    'awkward', 'axis', 'baby', 'bacon', 'badge', 'balance', 'balcony', 'ball', 'bargain', 'base', 
    'basic', 'beach', 'bean', 'because', 'beef', 'begin', 'believe', 'below', 'belt', 'bench', 
    'benefit', 'best', 'between', 'bicycle', 'bike', 'bind', 'biology', 'bird', 'birth', 'black', 
    'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood', 'blossom', 'blue', 
    'blur', 'blush', 'board', 'boat', 'body', 'boil', 'bomb', 'bone', 'bonus', 'book', 'boost', 
    'boss', 'bracket', 'brain', 'brand', 'brass', 'brave', 'bread', 'brick', 'brief', 'bring', 
    'brisk', 'broom', 'brother', 'brown', 'brush', 'buddy', 'buffalo', 'build', 'bulb', 'bulk', 
    'burst', 'busy', 'buyer', 'buzz', 'cabbage', 'cabin', 'cable', 'cage', 'cake', 'call', 'calm',
    'camp', 'canal', 'candy', 'canoe', 'capable', 'capital', 'captain', 'card', 'cargo', 'carry', 
    'cart', 'case', 'cash', 'catalog', 'catch', 'cause', 'caution', 'cave', 'ceiling', 'century', 
    'certain', 'chair', 'chalk', 'chaos', 'chapter', 'chase', 'chat', 'cheap', 'check', 'chef', 'chest', 
    'chicken', 'chief', 'child', 'chimney', 'chronic', 'chuckle', 'chunk', 'churn', 'cigar', 'citizen', 
    'city', 'civil', 'claim', 'clap', 'clarify', 'claw', 'clay', 'clean', 'clerk', 'click', 'cliff', 
    'climb', 'clip', 'clock', 'clog', 'close', 'cloth', 'cloud', 'clown', 'club', 'clump', 'cluster', 
    'coach', 'coast', 'coconut', 'code', 'coil', 'coin', 'collect', 'color', 'combine', 'come', 'comfort', 
    'comic', 'company', 'concert', 'conduct', 'confirm', 'connect', 'control', 'cook', 'cool', 'copy', 
    'coral', 'core', 'corn', 'correct', 'cost', 'couch', 'country', 'cover', 'crack', 'craft', 'cram', 
    'crane', 'crash', 'crawl', 'crazy', 'cream', 'creek', 'crew', 'cricket', 'crime', 'crisp', 'crop', 
    'cross', 'crowd', 'crucial', 'cruel', 'crumble', 'crush', 'crystal', 'cube', 'culture', 'curious',
    'current', 'curtain', 'curve', 'cushion', 'cute', 'cycle', 'damp', 'dance', 'dash', 'dawn', 'deal', 
    'decline', 'deer', 'defense', 'defy', 'delay', 'deliver', 'dentist', 'deny', 'deposit', 'depth', 
    'desk', 'despair', 'destroy', 'develop', 'diagram', 'dial', 'diamond', 'diary', 'dice', 'diet', 
    'digital', 'dignity', 'dilemma', 'dirt', 'disease', 'dish', 'dismiss', 'display', 'divorce', 'dizzy', 
    'doll', 'dolphin', 'donor', 'door', 'dose', 'dove', 'draft', 'drama', 'drastic', 'draw', 'dream', 
    'dress', 'drift', 'drill', 'drink', 'drip', 'drive', 'drop', 'drum', 'duck', 'dumb', 'dune', 'dust', 
    'dutch', 'duty', 'dwarf', 'dynamic', 'eager', 'eagle', 'early', 'earn', 'earth', 'east', 'easy', 
    'echo', 'ecology', 'economy', 'edge', 'edit', 'educate', 'eight', 'elbow', 'elder', 'elegant', 
    'element', 'elite', 'else', 'embrace', 'emotion', 'empower', 'empty', 'enact', 'endless', 'endorse', 
    'enemy', 'enforce', 'enhance', 'enjoy', 'enter', 'entry', 'episode', 'equal', 'equip', 'erase', 
    'erode', 'erosion', 'error', 'erupt', 'essay', 'essence', 'eternal', 'evil', 'evoke', 'exact', 'example', 
    'exclude', 'execute', 'exhaust', 'exhibit', 'exile', 'exist', 'exit', 'explain', 'express', 'extra', 
    'eyebrow', 'face', 'faculty', 'fade', 'faint', 'faith', 'fall', 'false', 'fame', 'fancy', 'fantasy', 
    'farm', 'fashion', 'fatal', 'fatigue', 'fault', 'feature', 'federal', 'feed', 'feel', 'fence', 'fetch', 
    'fever', 'fiber', 'fiction', 'field', 'file', 'film', 'final', 'find', 'fine', 'fire', 'firm', 'first', 
    'fish', 'fitness', 'flag', 'flame', 'flash', 'flat', 'flee', 'flip', 'float', 'flock', 'floor', 'fluid', 
    'flush', 'foam', 'focus', 'foil', 'fold', 'food', 'foot', 'force', 'fork', 'fortune', 'forum', 'forward', 
    'found', 'fragile', 'frame', 'fresh', 'frog', 'front', 'frost', 'frown', 'fruit', 'fuel', 'funny', 'furnace',
    'fury', 'gain', 'gallery', 'game', 'garbage', 'garment', 'gasp', 'gate', 'gauge', 'gaze', 'general', 'genre', 
    'genuine', 'gesture', 'ghost', 'giant', 'gift', 'giraffe', 'girl', 'give', 'glad', 'glare', 'glass', 'glide', 
    'glimpse', 'globe', 'gloom', 'glory', 'glove', 'glow', 'glue', 'goat', 'goddess', 'gold', 'good', 'goose', 
    'gorilla', 'gown', 'grab', 'grace', 'grain', 'grant', 'grape', 'grass', 'gravity', 'great', 'green', 'grid', 
    'grief', 'grit', 'grocery', 'group', 'grow', 'grunt', 'guard', 'guess', 'guide', 'guilt', 'habit', 'hair', 
    'half', 'hamster', 'hand', 'happy', 'hard', 'harsh', 'harvest', 'have', 'hawk', 'head', 'heart', 'heavy', 
    'hello', 'help', 'hero', 'high', 'hill', 'hint', 'hire', 'history', 'hobby', 'hold', 'hole', 'holiday', 
    'home', 'honey', 'hood', 'hope', 'horn', 'horse', 'host', 'hotel', 'hour', 'hover', 'huge', 'human', 'humor', 
    'hundred', 'hunt', 'hurry', 'hurt', 'husband', 'icon', 'idea', 'idle', 'illegal', 'illness', 'image', 
    'imitate', 'immense', 'improve', 'impulse', 'inch', 'include', 'index', 'inflict', 'inherit', 'initial', 
    'inner', 'input', 'inquiry', 'inspire', 'install', 'into', 'involve', 'iron', 'isolate', 'issue', 'item', 
    'ivory', 'jazz', 'jealous', 'jeans', 'jelly', 'jewel', 'join', 'joke', 'journey', 'judge', 'juice', 'jump', 
    'junk', 'just', 'keen', 'keep', 'ketchup', 'kick', 'kind', 'kingdom', 'kiss', 'kitchen', 'kite', 'kiwi', 'knee', 
    'knife', 'knock', 'know', 'label', 'labor', 'lady', 'lake', 'lamp', 'large', 'later', 'latin', 'laugh', 
    'laundry', 'lava', 'lawn', 'lawsuit', 'layer', 'lazy', 'leaf', 'learn', 'leave', 'lecture', 'left', 'legal', 
    'leisure', 'lemon', 'lend', 'lens', 'leopard', 'level', 'liar', 'liberty', 'library', 'license', 'life', 'lift', 
    'light', 'like', 'limb', 'limit', 'link', 'lion', 'list', 'live', 'load', 'loan', 'lobster', 'local', 'lock', 
    'logic', 'long', 'loop', 'lottery', 'loud', 'love', 'loyal', 'lucky', 'luggage', 'lunar', 'lunch', 'machine',
     'magic', 'maid', 'mail', 'main', 'major', 'make', 'mandate', 'mango', 'mansion', 'maple', 'march', 'mask',
      'mass', 'match', 'math', 'maximum', 'maze', 'mean', 'measure', 'meat', 'medal', 'media', 'melt', 'mention', 
      'menu', 'mercy', 'merge', 'merit', 'merry', 'mesh', 'message', 'metal', 'milk', 'million', 'mimic', 'mind', 
      'minimum', 'minor', 'miracle', 'miss', 'mistake', 'mixed', 'mixture', 'model', 'monitor', 'monster', 'month', 
      'moon', 'moral', 'more', 'morning', 'motor', 'mouse', 'move', 'movie', 'much', 'mule', 'music', 'must', 
      'mystery', 'myth', 'naive', 'name', 'nasty', 'near', 'neck', 'need', 'neglect', 'neither', 'nerve', 'nest', 
      'network', 'neutral', 'never', 'news', 'next', 'nice', 'night', 'noble', 'noise', 'nominee', 'north', 'nose', 
      'notable', 'note', 'nothing', 'novel', 'nuclear', 'nurse', 'obey', 'obscure', 'observe', 'obvious', 'occur', 
      'ocean', 'october', 'odor', 'offer', 'often', 'okay', 'olive', 'olympic', 'omit', 'once', 'onion', 'only', 
      'open', 'opera', 'opinion', 'orbit', 'orchard', 'order', 'organ', 'ostrich', 'other', 'outdoor', 'outer', 
      'outside', 'oval', 'oven', 'over', 'owner', 'ozone', 'pact', 'page', 'pair', 'palm', 'panda', 'panel', 'panic',
       'panther', 'paper', 'park', 'party', 'pass', 'patch', 'path', 'patient', 'pattern', 'pause', 'pave', 'payment', 
       'peace', 'pear', 'peasant', 'pelican', 'penalty', 'perfect', 'phone', 'photo', 'piano', 'picture', 'piece', 'pill', 'pilot', 'pink', 'pioneer', 'pipe', 'pitch', 'pizza', 'place', 'plastic', 'plate', 'play', 'pluck', 'plug', 'poem', 'poet', 'point', 'polar', 'pole', 'pond', 'pony', 'pool', 'popular', 'portion', 'post', 'pottery', 'poverty', 'power', 'predict', 'prepare', 'present', 'prevent', 'price', 'pride', 'primary', 'print', 'private', 'prize', 'problem', 'process', 'produce', 'program', 'project', 'promote', 'proof', 'prosper', 'protect', 'proud', 'provide', 'pudding', 'pull', 'pulp', 'pulse', 'pumpkin', 'punch', 'pupil', 'puppy', 'purpose', 'purse', 'push', 'pyramid', 'quality', 'quantum', 'quarter', 'quick', 'quit', 'quiz', 'quote', 'raccoon', 'race', 'rack', 'radar', 'radio', 'rail', 'rain', 'raise', 'rally', 'ramp', 'ranch', 'range', 'rapid', 'rare', 'rate', 'raven', 'razor', 'ready', 'real', 'rebel', 'rebuild', 'receive', 'recycle', 'reflect', 'regular', 'relax', 'release', 'rely', 'renew', 'rent', 'replace', 'require', 'retreat', 'reunion', 'rice', 'rich', 'ride', 'ridge', 'rifle', 'right', 'rigid', 'ring', 'riot', 'risk', 'rival', 'river', 'road', 'roast', 'robot', 'romance', 'roof', 'room', 'rose', 'rough', 'round', 'route', 'royal', 'rude', 'rule', 'rural', 'sadness', 'safe', 'sail', 'salad', 'salon', 'salt', 'same', 'sand', 'satisfy', 'satoshi', 'sauce', 'sausage', 'save', 'scale', 'scan', 'scare', 'scatter', 'scene', 'science', 'scout', 'scrap', 'scrub', 'seat', 'section', 'seed', 'seek', 'segment', 'sell', 'seminar', 'sense', 'service', 'session', 'setup', 'seven', 'shaft', 'shallow', 'share', 'shed', 'shell', 'sheriff', 'shift', 'shine', 'ship', 'shock', 'shoe', 'shoot', 'shop', 'short', 'shove', 'shrug', 'shuffle', 'sibling', 'sick', 'side', 'siege', 'sight', 'sign', 'silk', 'silly', 'similar', 'since', 'sing', 'siren', 'situate', 'size', 'skate', 'skill', 'skin', 'skirt', 'skull', 'slab', 'slam', 'sleep', 'slender', 'slice', 'slide', 'slim', 'slot', 'slow', 'slush', 'small', 'smart', 'smile', 'smoke', 'snack', 'snake', 'snap', 'sniff', 'snow', 'soap', 'sock', 'soda', 'soft', 'solar', 'soldier', 'solid', 'solve', 'someone', 'song', 'soon', 'sorry', 'sort', 
    'soul', 'sound', 'soup', 'south', 'space', 'spare', 'spatial', 
    'spawn', 'speak', 'special', 'speed', 'spell', 'spend', 'spice', 'spike', 
    'spin', 'split', 'spoil', 'sponsor', 'spoon', 'sport', 'spot', 'spray', 'squeeze', 'stadium', 'staff', 'stage', 'stamp', 'stand', 'start', 'state', 'stay', 'steak', 'steel', 'stem', 'step', 'stick', 'still', 'sting', 'stock', 'stomach', 'stone', 'stool', 'story', 'stove', 'student', 'stuff', 'stumble', 'style', 'subject', 'success', 'such', 'sugar', 'suggest', 'suit', 'sunny', 'super', 'supreme', 'sure', 'surface', 'surge', 'suspect', 'sustain', 'swallow', 'swamp', 'swap', 'swarm', 'swear', 'sweet', 'swift', 'swim', 'swing', 'sword', 'symptom', 'syrup', 'table', 'tail', 'talk', 'tank', 'tape', 'task', 'taste', 'taxi', 'teach', 'team', 'tell', 'tent', 'term', 'test', 'text', 'thank', 'that', 'theme', 'then', 'there', 'they', 'thing', 'this', 'thought', 'three', 'throw', 'thumb', 'thunder', 'tide', 'tiger', 'tilt', 'time', 'tiny', 'tired', 'title', 'toast', 'tobacco', 'today', 'toddler', 'token', 'tone', 'tonight', 'tool', 'tooth', 'topic', 'torch', 'tornado', 'toss', 'total', 'tourist', 'tower', 'town', 'track', 'trade', 'traffic', 'train', 'trap', 'trash', 'tray', 'treat', 'tree', 'trend', 'trial', 'tribe', 'trick', 'trigger', 'trim', 'trip', 'trouble', 'truck', 'true', 'truly', 'trumpet', 'trust', 'truth', 'tube', 'tuition', 'tuna', 'turn', 'twice', 'twin', 'twist', 'type', 'typical', 'ugly', 'unaware', 'uncle', 'uncover', 'under', 'undo', 'unhappy', 'uniform', 'unit', 'unknown', 'until', 'unusual', 'upgrade', 'upon', 'upper', 'upset', 'urban', 'urge', 'usage', 'used', 'useless', 'usual', 'utility', 'vague', 'valid', 'valve', 'vapor', 'various', 'vast', 'vault', 'vehicle', 'venture', 'venue', 'verb', 'version', 'very', 'veteran', 'vibrant', 'vicious', 'victory', 'video', 'view', 'village', 'vintage', 'virtual', 'virus', 'visa', 'visit', 'vital', 'vivid', 'vocal', 'voice', 'void', 'volcano', 'vote', 'wage', 'wagon', 'wait', 'walk', 'wall', 'want', 'warfare', 'warm', 'warrior', 'wash', 'wasp', 'waste', 'water', 'wave', 'wear', 'weather', 'wedding', 'weekend', 'weird', 'welcome', 'west', 'whale', 'what', 'wheat', 'wheel', 'when', 'where', 'whip', 'whisper', 'wide', 'width', 'wife', 'wild', 'will', 'wine', 'wing', 'wink', 'wire', 'wise', 'wish', 'witness', 'wolf', 'woman', 'wood', 'wool', 'word', 'work', 'world', 'worry', 'worth', 'wrap', 'wreck', 'wrestle', 'wrist', 'write', 'wrong', 'yard', 'year', 'young', 'youth', 'zebra', 'zero', 'zone']



// Create a writable stream to store the results
const output = fs.createWriteStream('keypairs.txt');

// Ethereum provider (you can use Infura, Alchemy, or any other provider)
// Replace with your own Infura project ID or other provider's URL
const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");

// Function to check the balance of an Ethereum address
async function checkBalance(address) {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance); // Convert to Ether
}

// Iterate over all possible combinations of the 11th and 12th words
(async () => {
    for (let i = 0; i < WORDLIST.length; i++) {
        for (let j = 0; j < WORDLIST.length; j++) {

            console.log("Generating account for word combination:", i, j);
            // Construct the full mnemonic phrase
            const mnemonic = `${baseMnemonic} ${WORDLIST[i]} ${WORDLIST[j]}`;

            // Generate the seed from the mnemonic
            const seed = bip39.mnemonicToSeedSync(mnemonic);

            // Generate the HD wallet
            const hdWallet = hdkey.fromMasterSeed(seed);

            // Derive the first account using the BIP44 path for Ethereum (m/44'/60'/0'/0/0)
            const path = "m/44'/60'/0'/0/0";
            const wallet = hdWallet.derivePath(path).getWallet();

            // Get the private key and Ethereum address
            const privateKey = wallet.getPrivateKey().toString('hex');
            const address = '0x' + ethUtil.privateToAddress(wallet.getPrivateKey()).toString('hex');

            // Check the balance of the address
            const balance = await checkBalance(address);

            console.log("balance of address: ", privateKey, balance);

            // Write the mnemonic, private key, Ethereum address, and balance to the file
            output.write(`Mnemonic: ${mnemonic}\n`);
            output.write(`Private Key: ${privateKey}\n`);
            output.write(`Address: ${address}\n`);
            output.write(`Balance: ${balance} ETH\n`);
            output.write('-------------------------------------------------------------\n');
        }
    }

    // Close the writable stream
    output.end(() => {
        console.log('Private keys, addresses, and balances generated and saved to keypairs.txt');
    });
})();