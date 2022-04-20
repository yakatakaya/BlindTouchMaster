window.AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = null;
var oscillator;
var gain;
var isPlaying = false;
var currentKeyCode = "";

class SoundKeyCode{
    constructor(sound, keyCode){
        this.sound = sound;
        this.keyCode = keyCode;
    }
    play(isCorrect){
        if(isPlaying && currentKeyCode != this.keyCode){
            oscillator.stop();
        }
        if(currentKeyCode != this.keyCode){
            let hz
            if(isCorrect){
                hz = this.sound;
            }else{
                hz = this.sound + base;
            }
            oscillator = ctx.createOscillator();
            oscillator.type = "square"; // sine, square, sawtooth, triangleがある
            oscillator.frequency.setValueAtTime(hz, ctx.currentTime);
            oscillator.connect(ctx.destination);
            oscillator.start();
            isPlaying = true;
            currentKeyCode = this.keyCode;
        }

    }
    stop(){
        if(this.isPlaying){
            this.oscillator?.stop();
            this.isPlaying = false;
        }
    }
}

class Sound{
    constructor(sound, duration){
        this.sound = sound;
        this.duration = duration;
    }
}

let isCorrect = true;
var n=0;

const base = 440; //ラ=440(442)Hz
const d = Math.pow(2, 1 / 12);
var C   = (base * Math.pow(d, -9)); //ド
var C_S = (base * Math.pow(d, -8)); //ド#
var D   = (base * Math.pow(d, -7)); //レ
var D_S = (base * Math.pow(d, -6)); //レ#
var E   = (base * Math.pow(d, -5)); //ミ
var F   = (base * Math.pow(d, -4)); //ファ
var F_S = (base * Math.pow(d, -3)); //ファ#
var G   = (base * Math.pow(d, -2)); //ソ
var G_S = (base * Math.pow(d, -1)); //ソ#
var A   = (base * Math.pow(d, 0)); // ラ
var A_S = (base * Math.pow(d, 1)); // ラ#
var B   = (base * Math.pow(d, 2)); // シ


const abcSongKeyScore = [
    // ABCDEFG
    new SoundKeyCode(C, "KeyA"),
    new SoundKeyCode(C, "KeyB"),
    new SoundKeyCode(G, "KeyC"),
    new SoundKeyCode(G, "KeyD"),
    new SoundKeyCode(A, "KeyE"),
    new SoundKeyCode(A, "KeyF"),
    new SoundKeyCode(G, "KeyG"),
    // HIJKLMN
    new SoundKeyCode(F, "KeyH"),
    new SoundKeyCode(F, "KeyI"),
    new SoundKeyCode(E, "KeyJ"),
    new SoundKeyCode(E, "KeyK"),
    new SoundKeyCode(D, "KeyL"),
    new SoundKeyCode(D, "KeyM"),
    new SoundKeyCode(C, "KeyN"),
    // OPQRSTU
    new SoundKeyCode(G, "KeyO"),
    new SoundKeyCode(G, "KeyP"),
    new SoundKeyCode(F, "KeyQ"),
    new SoundKeyCode(F, "KeyR"),
    new SoundKeyCode(E, "KeyS"),
    new SoundKeyCode(E, "KeyT"),
    new SoundKeyCode(D, "KeyU"),
    // VWXYZ
    new SoundKeyCode(G, "KeyV"),
    new SoundKeyCode(F, "KeyW"),
    new SoundKeyCode(E, "KeyX"),
    new SoundKeyCode(E, "KeyY"),
    new SoundKeyCode(D, "KeyZ")
];


document.onkeydown = 
    function keydown(key) {
        if(ctx === null){
            ctx = new AudioContext();
            gain = ctx.createGain();
            gain.gain.value = 0.1;
        }

        if(key.code != currentKeyCode){
            oscillator?.stop();
                
            if(key.code == abcSongKeyScore[n].keyCode){
                hz = abcSongKeyScore[n].sound;
                let element = document.getElementById(abcSongKeyScore[n].keyCode);
                element.classList.add("correct");
                element.classList.remove("miss")
                n++;
            }else{
                hz = abcSongKeyScore[n].sound + base;
                let element = document.getElementById(abcSongKeyScore[n].keyCode);
                element.classList.add("miss");

            }
            
            play(hz);

        }
        currentKeyCode = key.code;
    };

function play(sound){
    oscillator = ctx.createOscillator();
    oscillator.type = "square"; // sine, square, sawtooth, triangleがある
    oscillator.frequency.setValueAtTime(sound, ctx.currentTime);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();

    isPlaying = true;
}

document.onkeyup = 
    function keyup(key) {
        if(key.code == currentKeyCode){
            oscillator.stop();
            isPlaying = true;
            currentKeyCode = "";
        }

        if(abcSongKeyScore.length == n){
            Ending();

            abcSongKeyScore.forEach(s =>{
                let element = document.getElementById(s.keyCode);
                element.classList.remove("correct");
                element.classList.remove("miss");

            })
            n = 0;

        }
    }

const Ending = () => {
    const abcSongEndingScore = [
        new Sound(C, 0.2),
        new Sound(C, 0.2),
        new Sound(G, 0.2),
        new Sound(G, 0.2),
        new Sound(A, 0.2),
        new Sound(A, 0.2),
        new Sound(G, 0.4),
        new Sound(F, 0.2),
        new Sound(F, 0.2),
        new Sound(E, 0.2),
        new Sound(E, 0.2),
        new Sound(D, 0.2),
        new Sound(D, 0.2),
        new Sound(C, 0.4)
    ];
    
    const audioContext = new AudioContext();
    const t0 = audioContext.currentTime;
    let t = 0;
    
    var oscillator = audioContext.createOscillator();
    var gain = audioContext.createGain();
    gain.gain.value = 0.1;
    
    oscillator.type = "square";
    abcSongEndingScore.forEach((s) => {
        const d = s.duration; //テンポ80
        oscillator.frequency.setValueAtTime(s.sound, t0 + t);
        t += d;
    });
    oscillator.connect(gain);
    
    gain.connect(audioContext.destination);
    oscillator.start(t0);
    oscillator.stop(t0 + t);


};
