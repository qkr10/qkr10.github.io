let SomeThingsNeverChange =
`Yes, the wind blows a little bit colder
And we're all getting older
And the clouds are moving on with every autumn breeze.
Peter pumpkin just became fertilizer

And my leaf's a little sadder and wiser

That's why I rely on certain certainties…
Yes
Some things never change
Like the feel of your hand in mine
Some things stay the same

Like how we get along just fine

Like an old stone wall
That'll never fall
Some things are always true!
Some things never change
Like how I'm holding on tight to you.

The leaves are already falling
Sven, it feels like the future is calling!

Are you telling me tonight you're going to get down on one knee?

Yeah, but I'm really bad at planning these things out
Like candlelight and pulling of rings out

Maybe you should leave all the romantic stuff to me

Yeah, some things never change
Like the love that I feel for her
Some things stay the same
Like how reindeers are easier
But if I commit
And I go for it
I'll know what to say and do!
Right?

Some things never change…

Sven, the pressure is all on you

The winds are restless
Could that be why I'm hearing this call?
Is something coming?
I'm not sure I want things to change at all
These days are precious, can't let them slip away…
I can't freeze this moment
But I can still go out and seize this day!!

Ah-ah-ah-ah-ah-ah
The wind blows a little bit colder

And you all look a little bit older!

It's time to count our blessings

Beneath an autumn sky!

We'll always live in a kingdom of plenty
That stands for the good of the many!

And I promise you the flag of Arendelle will always fly!!

Our flag will always fly!

Our flag will always fly!

Some things never change
Turn around and the time has flown
Some things stay the same
Though the future remains unknown
May our good luck last
May our past be past
Time's moving fast, it's true!

Some things never change

And I'm holdin' on tight to you…

Holdin' on tight to you…

Holdin' on tight to you…

Holdin' on tight to you…

I'm holdin' on tight to you.`;
let IntoTheUnknown = 
`Ah ah oh oh oh
Ah ah oh oh oh oh oh oh

I can hear you but I won't
Some look for trouble while others don't
There's a thousand reasons I should go about my day
And ignore your whispers which I wish would go away, oh oh oh
Ah ah oh oh
Oh oh
Ah ah oh oh

You're not a voice
You're just a ringing in my ear
And if I heard you, which I don't
I'm spoken for I fear
Everyone I've ever loved is here within these walls
I'm sorry, secret siren, but I'm blocking out your calls
I've had my adventure, I don't need something new
I'm afraid of what I'm risking if I follow you

Into the unknown
Into the unknown
Into the unknown
Ah ah oh oh
Ah ah oh oh oh oh

What do you want? 'Cause you've been keeping me awake
Are you here to distract me so I make a big mistake?
Or are you someone out there who's a little bit like me?
Who knows deep down I'm not where I'm meant to be?

Every day's a little harder as I feel my power grow
Don't you know there's part of me that longs to go…

Into the unknown?
Into the unknown
Into the unknown
Ah ah oh oh
Ah ah oh oh

Oh oh oh
Are you out there?
Do you know me?
Can you feel me?
Can you show me?
Ah ah oh oh
Ah ah oh oh
Ah ah oh oh
Ah ah oh oh
Oh oh oh oh
Oh oh oh oh
Oh oh oh oh
Oh oh oh oh

Where are you going?
Don't leave me alone
How do I follow you
Into the unknown?
Oh oh oh`;
let lyricList = [SomeThingsNeverChange, IntoTheUnknown];
let lyricNum = 0;
let strList = lyricList[lyricNum].split("\n");
let strNum = 0;
let strText = "";
let time = [0, 0];

function OnKeyPress(event){
    let character = String.fromCharCode(event.keyCode);
    let key = event.witch || event.keyCode;

    if (time[0] == 0){
        time[0] = (new Date()).getTime()/1000;
    }
    if (key == 13){ //enter
        time[1] = (new Date()).getTime()/1000;
        let t = "시간 : " + (time[1] - time[0]).toFixed(3);
        t += " 분당 글자 : " + (strList[strNum].length / (time[1] - time[0]) * 60).toFixed(3);
        TimeShow(t);

        strNum++;
        NextText();
        return;
    }

    if (key == 8){ //backspace
        strText = strText.slice(0, strText.length - 1);
        InputShow(strText);
        return;
    }

    if (key == 16) //shift
        return;
    character = character.toLowerCase();
    if (event.shiftKey){
        character = character.toUpperCase();
    }

    let list = [{
        32 : '\u00a0',
        188 : '\u002c',
        190 : '\u002e',
        186 : '\u003b',
        122 : '\u003b'},
    {   32 : '\u00a0',
        188 : '<',
        190 : '>',
        186 : ':',
        122 : '"'
    }];
    if ('A'.charAt(0) > key || key > 'Z'.charAt(0)) {
        character = list[event.shiftKey ? 1 : 0][key];
    }

    // if (key == 32){ //space
    //     character = '\u00a0'
    // }
    // if (key == 188){ //,
    //     character = '\u002c';
    // }
    // if (key == 190){ //.
    //     character = '\u002e';
    // }
    // if (key == 186){ //;
    //     character = '\u003b';
    // }
    // if (key == 186 && event.shiftKey){ //:
    //     character = '\u003a';
    // }
    // if (key == 222){ //'
    //     character = '\u0027';
    // }
    // if (key == 222 && event.shiftKey){ //"
    //     character = '\u0022';
    // }

    strText += character;
    InputShow(strText);
}

function NextText(){
    while(strList[strNum] == ''){
        strNum++;
    }
    TextShow(strList[strNum]);

    strText = "";
    InputShow(strText);
}
function TimeShow(text){
    document.getElementsByName("TimeLine")[0].innerText = text;
}
function TextShow(text){
    document.getElementsByName("TextLine")[0].innerText = text;
}
function InputShow(text){
    document.getElementsByName("InputLine")[0].innerText = text;
}
function setLyricNum(n){
    lyricNum = n;
    strList = lyricList[lyricNum].split("\n");
    strNum = 0;
    TextShow(strList[strNum]);
    time = [0, 0];
    TimeShow("");
    strText = "";
    InputShow(strText);
}
NextText();