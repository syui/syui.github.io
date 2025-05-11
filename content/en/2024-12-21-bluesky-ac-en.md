+++
date = "2024-12-21"
tags = ["bluesky","atproto", "lang:en"]
title = "atmosphere"
aliases = [
	"/en/post/2024/11/21/bluesky-ac-en"
]
+++

This year, I'm participating in the Bluesky Advent Calendar. I've prepared articles in both English and Japanese. [Bluesco Advent Calendar 2024](https://whtwnd.com/moja.blue/entries/%E3%83%96%E3%83%AB%E3%82%B9%E3%82%B3%E3%80%81%E3%82%A2%E3%83%89%E3%83%99%E3%83%B3%E3%83%88%E3%81%AE%E3%82%AB%E3%83%AC%E3%83%B3%E3%83%80%E3%83%BC2024) <a href="/en/post/2024/11/21/bluesky-ac-en/"><button>en</button></a> <a href="/blog/post/2024/11/21/bluesky-ac-ja/"><button>ja</button></a>

## What is atmosphere?

First, let's explain the terminology. `at` has various meanings embedded in it. For example, `@`, `at://`, `[at]mosphere`, `[a]uthenticated [t]ransfer`, etc. In the early days, the icon was `@`.

|word|name|example|
|---|---|---|
|at|uri|at://syui.ai|
|@|user|@syui.ai|
|[at]proto|repo|`git@github.com:bluesky-social/atproto`|
|[at]mosphere|system|pds, bsky(appview), ozone, bgs, plc|
|[a]uthenticated [t]ransfer|protocol|[did](https://www.w3.org/TR/did-core/)|

> Atmosphere
> 
> "Atmosphere" is a term used to describe the ecosystem of the AT protocol.
> AT Protocol
> 
> AT Protocol stands for "Authenticated Transfer Protocol". This name comes from the fact that all user data is signed by the creating user. This allows data to be broadcast through many services and proven authentic without direct communication with the originating server.
> 
> The name is also a play on the "@" symbol, aka the "at" symbol, as atproto is designed for social systems.

It seems that each area is named, and the entire system is called `atmosphere`.

The services under atmosphere are named after the Earth's atmospheric structure, such as `bluesky(bsky)`, `ozone`, `bigsky(bgs)`.

- https://github.com/bluesky-social/atproto/tree/main/services/bsky
- https://github.com/bluesky-social/atproto/tree/main/services/ozone
- https://github.com/bluesky-social/indigo/tree/main/cmd/bigsky

There are other things in the atmosphere like `meteor` and `aurora`, so they might be used for naming something in the future.

```json
{
  "atmosphere": {
    "uri": "https://atproto.com/ja/guides/glossary",
    "ref": "https://en.wikipedia.org/wiki/atmosphere_of_earth",
    "exosphere": {
      "km":[{ "min": 700, "max": 10000 }],
      "tag": [ "universe" ]
    },
    "thermosphere": {
      "km":[{ "min": 80, "max": 700 }],
      "tag": [ "aurora" ]
    },
    "mesosphere": {
      "km":[{ "min": 50, "max": 80 }],
      "tag": [ "meteor", "bigsky" ]
    },
    "stratosphere": {
      "km":[{ "min": 12, "max": 50 }],
      "tag": [ "ozone" ]
    },
    "troposphere": {
      "km":[{ "min": 0, "max": 12 }],
      "tag": [ "bluesky" ]
    }
  }
}
```

## Thoughts on Game Development

I'm currently developing a game using `atproto`.

Here's a summary of my thoughts on game development.

### The Invisible Part

The first thing I started working on was the invisible part.

Game engines are usually based on a plane. The map is just an endless horizon no matter how far you go. Even if you fly up into the sky, you can't escape the planet.

There's no need to create places in the game that you can't go to, so even if there's a moon in the game, it's just moving a picture in the background.

However, my idea is that even if you can't go to a place in the game, there should be things that should be there. If the moon rises in the game, I want to create something that characters can actually touch.

Unreal Engine has a feature called `atmosphere`, and with some ingenuity, I managed to make it work.

I want to continue game development with the philosophy of reflecting reality as much as possible.

### What Do People Want?

What do people want? This is something we need to consider when making games.

For example, even if the operation ends, you want to keep the data, right?

People have a desire to leave their traces, and living beings have an instinct to leave descendants. As a derivative of this, people are happy when what they've done is preserved. That's why I thought about saving data with `atproto`.

Users don't want to waste everything they've done, and they'd prefer "It's okay even if the service ends" over "It's over when the service ends". This is especially true if they're going to be active for decades to come.

`atproto` is creating something that can withstand the future.

### Where Do People Get Information From?

Where people get information from changes with the times.

In the past, it was from books. Then it became television, and now it's the internet.

People in the past got information from books, so books had value. I think publishers, newspapers, and bookstores had high value. But as television and the internet became widespread, publishing, newspapers, and bookstores started to struggle.

What's important is "people and information". The question is where people will get information from in the future. Currently, it's from the internet.

The next thing to consider is "how". Even if we get information from the internet, how will we get it? Let's think about that.

First, let's look at history. When the internet became widespread, the first thing that happened was that individuals started creating homepages. Anyone could create a homepage and disseminate information. Then search engines appeared.

People who initially accessed websites by entering URLs started accessing websites from search engines. Let's call this era 1.

Next came services. Various services were created, and social network services (SNS) appeared. Twitter, Facebook, and so on. Gradually, people started getting information from SNS rather than homepages or search engines. Let's call this era 2.

So what's next? This isn't clear yet.

But I feel like the outline is starting to become visible. I think it will be something like `activitypub` or `atproto`. And AI. AI also gets information from people, and it's necessary for people to disseminate information.

Indeed, in era 2, people started creating accounts on services. All posts are attributed to that service. Not to individuals. Of course, where people get information from is also within the service. This has been the form and way of the internet in recent years.

But it was different in 1. Search engines resulted in traffic to personal sites.

I think that in 3, we'll head back in the direction of 1, that is, towards individuals. From individuals to corporations. From corporations to individuals. It's not that simple, but I think we'll move towards individuals in a way that's balanced for the times.

This doesn't mean we're simply going back to 1. There were many problems with 1. It's because of these problems that 2 came to be used. For example, it became increasingly difficult to find the information you were looking for with search engines, right? I think the transition to 3 will happen while balancing and avoiding such problems.

And in any era, the only thing we can choose is where to place our own identity.

atproto is well-balanced in this respect.

### Why atproto?

I've been using activitypub since around 2016. I set up a Mastodon instance around that time. I remember it was around the time when the Japanese instance was just being set up or not yet set up... At that time, it was using a protocol called `ostatus`, and soon after, it transitioned to activitypub.

Besides Mastodon, I was setting up `pleroma`, `misskey`, `mitra`, `gnu-social`, etc. on Heroku.

It was a very interesting technology, and I really enjoyed it at that time.

Then, after several years passed, I started `bluesky` around 2023.

Bluesky adopts a protocol called at. When I saw that, I thought that the future internet might become `at`.

```sh
https://syui.ai --> at://syui.ai
```

activitypub and atproto have fundamentally different systems. One of these is the preservation of history.

For example, if you create an account or server, with atproto, you can check its history from plc. When it was set up, how the name was changed, etc.

I said "I've been using activitypub since around 2016", but the records from that time only exist on my blog. Since I've reset the db several times since then, it looks like I just opened it recently on Mastodon.

activitypub doesn't have a centralized function, and each server saves records independently. Traces might be left somewhere, but we don't know where.

atproto can solve these kinds of problems. Think back to when search engines became popular, but technologies that gain dominance and are used by many people don't put technology at the forefront.

It's not about "Choose your favorite server" or "This technology is decentralized and non-centralized", but rather, the protocol shouldn't be something that users are conscious of. I want it to be distributed internally and do difficult things behind the scenes.

In other words, it needs to be understandable even for people who are touching it for the first time. And that must be directly linked to results.

Results mean things like "If you search, you get results". For SNS, it means "You can connect without being conscious of the server".

This is difficult with activitypub. It's related to the core of the technology, so it's difficult to solve, and I think it's fatal.

Also, to use your own name, you need to set up a server.

|protocol|user|body|
|---|---|---|
|activitypub://|@syui@syui.ai|Need to set up a server|
|at://|@syui.ai|Can be set up without setting up a server and it's shorter|

I particularly like the `at://` part. It's short, concise, and yet a meaningful name.

### What about nostr?

To me, nostr seems like a more promising protocol than activitypub.

However, if we're talking about whether it will spread or not, I predict that it won't spread that much.

Bluesky and atproto have clear accountability, and it's easy to understand who's operating them. They're in an environment where spam can be eliminated. Conversely, in environments where this isn't clear, it's easy to become full of spam. I think such things are dealt with individually by relay server administrators, and there might be servers where spam doesn't come. But for ordinary people, it's incomprehensible. Even I would say, "Where is that?"

This kind of nature is sometimes called lawlessness, disorder, irresponsible decentralization, and I think ordinary people wouldn't want to live there.

It's not that difficult to create such places on the net. However, given the history of search engines becoming desolate, that didn't work well. That's why we need to consider what to do, how to create order, and how to maintain it. People have been thinking about this and seeking solutions for many years.

I think many people are seeking well-balanced order.

For example, a world where all individuals are independent, self-reliant, and can do anything by themselves. A world where all residents have stable minds, don't cause disputes or troubles, no one does bad things, and everyone lives doing everything by themselves. In such a world, it's strange to have rules, laws, administrators, or governments. Because such things are not necessary. At this stage, lawlessness is correct.

But whether such things will become widespread at this stage now, I think it's difficult.

### The Limits of Names

Humans use names, not numbers, in any era. For example, programming languages are also things that convert names to numbers. This is because names are easier for humans to read and write. Therefore, names are important.

Now, let's think about these names.

I feel that the current internet has limitations with these names.

The current internet completes information exchange only within services. For example, information exchange is completed only within Twitter, Facebook, YouTube, right? To make these interact with each other, they need to adopt the same protocol.

My prediction was that in the future internet, services would be able to interact with each other.

And here, I think we're heading towards that future for two reasons, one of which is that names have limitations.

Names are being exhausted in each service, but there are many people who will be born and new companies that will be created. They are the future information trend. Growth can't be expected if they don't come in.

However, new people can't use the names they want to use. Because those names are already taken. Then it's natural to go somewhere else.

In other words, I think this problem will naturally move towards resolution. I predict it will become a `domain` format.

In the future, the names people use will become domain format, because (1) names are being exhausted in each service, and (2) you can't interact outside the service unless you make the name a domain format. And I predict that in the future internet, it will become common to use multiple services with one account.

### Gravity and Weak Force

Araragi: "Names don't matter at all."

Oshino: "No, names are important, Araragi-kun."

Which of these two exchanges is correct?

The answer is "Both are correct."

However, if I had to say, the former seeks immediacy and impact, while the latter seeks influence and environment.

From here, I'll talk a bit about the natural world. Do you know what the weakest force in the natural world is?

The answer is gravity.

You might be surprised, but in current science, gravity is considered the weakest force in this world.

However, you might think that gravity should be powerful enough to construct the current universe environment.

That's right. In this world, weaker forces have greater influence and construct the environment. This is the law of nature, the principle of nature.

Let's go back to thinking about names.

Names don't have the power to change something instantly. They don't have immediacy or impact.

However, they affect human consciousness and subconsciousness, shaping the environment over a long period of time. They have an effect similar to gravity.

For example, human society is constructed by people's consciousness.

### Spreading

For protocols, spreading to many people becomes the most important thing.

This is not limited to protocols, but the more fundamental the technology, the more it becomes a game of who can spread it the most.

The fundamental part is easy to understand if you think about it in terms of time.

What people use the most time in a day, the answer is computers.

Therefore, those who develop and provide the most widely used OS gain dominance.

This is easy to understand if you think about market capitalization. Microsoft (Windows) and Apple (Mac/iOS).

Recently, as AI consumes (reduces) enormous amounts of time, Nvidia (GPU) has gained a huge market capitalization.

Looking at human history, spreading something has the most value.

For example, spreading one's own story is called religion. The dollar as the key currency has great power. Language is the same. The influence of English is immeasurable.

### Similar Things Don't Spread

I often play a game called Genshin Impact.

Should I make a game like Genshin Impact then? I don't think that's good. Even if you make something of the same or higher quality, I think it would be difficult. Why? Because Genshin Impact already exists.

Recently, I've been hooked on watching VTuber videos. However, I thought it would be difficult to start as a VTuber now. I feel that those who benefit as VTubers are those who have been working on it since the time when such a concept didn't exist, not those who are starting now.

Even if you try to imitate or enter what's popular now, it's already too late. If you're going to do something, do something different.

### What do people find fun?

When I thought about what kind of game I should make, the answer was "to entertain people".

However, I think there is a limit to what I can do by myself to make a fun game.

So what I need to think about are the people who are already "entertaining people".

If I can connect vtubers who entertain the viewers with games, I think I can spread the word about both the game and the person at the same time.

And currently, it is difficult to become a vtuber, and there are too many things to do.

For example, you need to prepare a 3D model, open a Twitter account, choose the game you want to play, set up a live environment, open a YouTube channel, and display your username, account, and model on the screen. You also need a voice environment, and you have to operate the game while talking and operate the live screen.

I thought it would be nice to be able to integrate all of this.

What do people find fun? Let's think about it from the basics again.

In previous games, the player became the protagonist of the game and relived the story. That's the case with my favorite games. For example, in Genshin Impact, there are two main characters, Hotaru and Sora, and it is their story.

But don't you think you want to play the story of the main character? What is it that players really want?

There are already games that are designed in this direction, for example, there are games where you start by creating your own character and customizing the main character.

But I don't play those kinds of games very often. I don't know how to customize, it's troublesome, and even if I customize it, it doesn't feel right. That's why I don't play many games of the "make it yourself" type. I prefer games like Genshin Impact where the characters are well-made from the beginning.

After all, customization games are hard at first. I don't understand it well, and it's troublesome. I think the most important thing is to be able to start right away.

So what about cases like this? For example, if Genshin Impact had a character designed by me and I could control it. I would definitely play it with joy. I think I would be able to become attached to that character. Voice actors also play Genshin Impact, and it was impressive to see them enjoying the characters that used their own voices.

In other words, if more players can have this experience, the game will surely become more fun.

What is needed to achieve this? One of them is uniqueness.

### Uniqueness of the player

In this game, we aim to give each player uniqueness. In other words, we design the game to ensure the uniqueness of the player.

How do we achieve this? I will tell you what I am thinking now.

From here on, I will talk about more specific directions. If you are not interested, I recommend you skip this.

- Players are assigned one character
- The character that can be used is unique to the player. It has a unique skill that only that player can use
- There is one pickup period per character. Characters drawn by gacha cannot use unique skills

One is given for each character, and when it reaches 0, it will not be picked up again.

The reason is that I know developers well. If there are no restrictions, there is a risk of repeated reprints and remakes. Now we don't have time, so we can just reprint and remake.

As we do this, we lose the ability to create new things. We have set rules so that if you want to play gacha, you have no choice but to make something new.

The uniqueness of the player is an accumulation of `irreversible elements`.

## Let's go to the atmosphere

From here, we will introduce examples of the game's functions.

<!--
<video src="" width="100%" height="500px"></video>
-->
<iframe
width="100%" height="650"
frameborder="0" allow="autoplay; encrypted-media" allowfullscreen
src="https://www.youtube.com/embed/rJXC_sfnoBo"></iframe>

### About characters

Each character is assigned one attribute. The assigned character has a group, and it transitions with each season. The attribute is different for each group. And it will not return to the previous season.

The first group we plan to have is `fantasy`, followed by `animal`. Fantasy can handle one of the `atomic` attributes. Animal is one of the `molecular` attributes.

For example, the character Dragon from Season 1 has the `atomic` attribute and is in the fantasy group. Other fantasy characters include the phoenix (proton) and pegasus (neutron). Animals include the whale (water) and lion (fire). The season you start the game in determines the character you are initially assigned to.

|season|group|type|character|
|---|---|---|---|
|1|fantasy|proton, neutron, nucleus, electron, quark|dragon, pegasus, phoenix...|
|2|animal|water, fire, rock, wind, ice|whale, lion, eagle...|
|3|...|...|...|

```json
{
  "atom": {
    "name": "atom",
    "group": [
      "fantasy"
    ],
    "lang": {
      "ja": "原子"
    },
    "ref": "https://en.wikipedia.org/wiki/atom",
    "body": {
      "text": "the word atom comes from the greek word atmos, which means indivisible. an atom consists of an atomic nucleus, which is made up of protons and neutrons, and electrons distributed around the nucleus",
      "lang": {
        "ja": "アトムはギリシャ語のアトモスの「これ以上分割できない」という単語が由来。原子は陽子と中性子からなる原子核と、その周囲に分布する電子から構成される"
      }
    },
    "enum": [
      "proton(陽子)",
      "neutron(中性子)",
      "atomic(原子核)",
      "electron(電子)",
      "quark(クォーク)"
    ]
  },
  "molecule": {
    "name": "molecule",
    "group": [
      "animal"
    ],
    "lang": {
      "ja": "分子"
    },
    "ref": "https://en.wikipedia.org/wiki/molecule",
    "body": {
      "text": "a neutrally charged substance made up of two or more atoms",
      "lang": {
        "ja": "2つ以上の原子から構成される電荷的に中性な物質"
      }
    },
    "enum": [
      "water(水)",
      "wind(風)",
      "rock(岩)",
      "ice(氷)",
      "fire(火)"
    ]
  }
}
```

Let's move on. Next, I'll explain about character evolution.

Just as humans have evolved from single-celled organisms, I designed the characters to evolve as well.

Each character can evolve to `model: animal -> human -> divinity`. In the game, you will be able to change forms to each model.

- animal -> human -> divinity

![](https://git.syui.ai/ai/ue/raw/branch/main/verse/img/shinka.png)

### About each area

They are divided into ground, sky, and space. However, that doesn't mean you'll be able to fly around freely.

I use eyes because they are convenient in development, but I don't think you'll be able to move around freely in the release version.

Because the frequency of bugs will increase.

To prevent bugs, we must limit the range and speed of freedom of movement. Also, the characters used in the demo are basically unusable because they have many development functions.

However, it is possible. If it becomes stable, you may be able to go there.

I introduced this part this time because I want you to know that there is an outside world.

The starry sky you look up at is real, you can actually go there, and the world is expanding.

### Choices should come first

I am thinking of making the game into three elements: `choices`, `diagnosis`, and `fate`.

- choices -> diagnosis -> fate

I think the choice element should come first. For example, if we apply this to the case of creating an account,

1. Select the gender of the character

2. The character is decided from the diagnosis

3. The status is assigned randomly, i.e. by fate (9:1)

There are many games where you choose your gender at the beginning, and I think this has an important meaning. One reason is that it makes the player understand that they have the right to choose the game.

### blueprint tips

To post to `atproto` in `blueprint`, do the following. Use `Content-Type:x_www_from_urlencoded_url`.

<iframe src="https://blueprintue.com/render/4yf7viyt/" width="100%" height="400px"></iframe>

- plugin : [varset](https://github.com/ufna/VaRest)
