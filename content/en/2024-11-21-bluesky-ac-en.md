+++
date = "2024-11-21"
tags = ["bluesky","atproto", "lang:en"]
title = "atmosphere"
+++

This year I participated in the Bluesky Advent Calendar. <a href="/en/post/2024/11/21/bluesky-ac-en/"><button>en</button></a> <a href="/blog/post/2024/11/21/bluesky-ac-ja/"><button>ja</button></a>

[Bluesco Advent Calendar 2024](https://whtwnd.com/moja.blue/entries/%E3%83%96%E3%83%AB%E3%82%B9%E3%82%B3%E3%80%81%E3%82%A2%E3%83%89%E3%83%99%E3%83%B3%E3%83%88%E3%81%AE%E3%82%AB%E3%83%AC%E3%83%B3%E3%83%80%E3%83%BC2024)

## what atmosphere

First, let's explain the terminology. `at` has various meanings. `@`, `at://`, `[at]mosphere`, `[a]uthenticated [t]ransfer`, etc.

https://atproto.com/guides/glossary

|title|name|
|---|---|
|at|uri|
|@|user|
|[at]proto|github repo|
|[at]mosphere|system|
|[a]uthenticated [t]ransfer|protocol|

> Atmosphere
>
> "Atmosphere" is the term used to describe the AT Protocol ecosystem.

> AT Protocol
>
> AT Protocol stands for "Authenticated Transfer Protocol". The name comes from the fact that all user data is signed by the creating user. This allows data to be broadcast through many services and prove its authenticity without having to communicate directly with the origin server.

>
> The name is a play on the "@" symbol, also known as the "at" symbol, since atproto is designed for social systems.

Each area is named, and the whole system is called `atmosphere`.

Each service is named after the atmospheric structure of the earth, such as `bluesky(bsky)`, `ozone`, `bigsky(bgs)`, etc.

- https://github.com/bluesky-social/atproto/tree/main/services/bsky
- https://github.com/bluesky-social/atproto/tree/main/services/ozone
- https://github.com/bluesky-social/indigo/tree/main/cmd/bigsky

There are also things like `meteor` and `aurora` in the atmosphere, so they may be used in service names in the future.

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

## Thoughts on game development

I'm making a game that logs in with atproto. This time, I'd like to summarize what I thought about game development.

### Invisible parts

I started making the invisible parts first.

In normal games, maps are created based on a flat surface. No matter how far you go, the horizon just spreads out. Even if you fly up into the sky, you cannot escape from the planet.

In the first place, there is no need to create places that you cannot go to in the game, so even if the moon is out in the game, it is just a picture of the moon moving in the background.

However, even if you cannot go to places in the game, there are places that should be there, even invisible parts.

For example, if the moon rises in the game, I want to make it something that the character can touch.

Unreal Engine has a function called `atmosphere`, and by using some ingenuity, I was able to make it into a shape.

Fortunately, Ai is a character who can fly freely in space (from the original work), so she doesn't violate the rules of this world.

### What do people want?

What do people want? This is something that must be considered when making a game.

For example, even after the game is no longer in operation, you want to keep your data.

People have a desire to leave their mark, and life has an instinct to leave offspring. As an offshoot of that, it would be nice if what you have done was left behind. That's why I'm thinking of saving the data with `atproto`.

### Where do people get information?

Where do people get information from? The source of information changes with the times.

In the past, it was from books, but then it became television and then the Internet.

In the past, people got information from books, so books had value. I think publishing companies, newspapers, and bookstores were very valuable. However, as television and the Internet became more widespread, it became more difficult to manage publishing, newspapers, and bookstores.

For me, the concept of the Internet is not that difficult. What's important is "people and information." Where do people get information? Nowadays, they probably get it from the Internet.

The next thing to consider is "how." Even if we get information from the Internet, how do we get it? Let's think about that.

First, let's look at history. When the Internet became widespread, the first thing that happened was that each individual created a homepage. Anyone could create a homepage, that is, a website, and then disseminate information. Then search engines appeared.

At first, people who accessed websites by entering URLs began to access websites from search engines. Let's call this era 1.

Next came services. Various services were created, and SNS appeared. Twitter, Facebook, etc. Gradually, people began to get information from SNS rather than from homepages or search engines. Let's call this era 2.

So what comes next? This is still unclear.

However, I feel like the outline is gradually becoming clear. I think it will be something like `activitypub` or `atproto`. And then there's AI. AI also gets information from people, and it will be necessary for people to disseminate information.

It's true that in the 2nd era, people began to create accounts on services. All posts are attributed to that service. Not to individuals. Of course, the source of information is also from within the service. This was the shape and way of the internet in recent years.

But it was different in 1. I think that 3 will result in the direction of 1 again. From individuals to companies. From companies to individuals. That's how it is. It's not that simple, though. It will move in the direction of individuals with a balance that suits the times.

This does not mean going back to 1 as it is. 1 had many problems. It is because of those problems that 2 came to be used. For example, it has become more common to not be able to find the information you are looking for using a search engine. I think the transition to 3 will be a balanced solution or avoidance of such problems.

atproto is well-balanced in that respect.

### Why atproto?

I've been playing with activitypub since around 2016. That was when I set up an instance on mastodon. I remember that it was around the time when jp was about to be launched.

At the time, I was using a protocol called `ostatus`, and I switched to activitypub shortly after that.

Besides Mastodon, I also set up `pleroma`, `misskey`, `mitra`, `gnu-social`, etc. on Heroku.

It's a very interesting technology, and I remember having a lot of fun at the time.

A few years later, I started using `BlueSky` around 2023.

BlueSky uses a protocol called AT. When I saw that, I thought that the future of the Internet might be `AT`.

```sh
https://syui.ai --> at://syui.ai
```

Activitypub and atproto are fundamentally different systems. One of them is the ability to preserve history.

For example, if you create an account or server, atproto allows you to check its history from the PLC. When it was built and how it was renamed.

I said that I've been using Activitypub since around 2016, but the only records from that time are on my blog. Since then, I've reset the database several times, so it looks like it was just recently opened on Mastodon.

Activitypub has no centralized function, and each server stores its own records. There may be traces left somewhere, but you don't know where.

atproto can solve this problem. Think back to when search engines were popular. Technologies that dominate and are used by many people don't put their technology on display.

It's not like "choose your favorite server" or "this technology is distributed and decentralized," but rather, the protocol is not something that users are aware of.

### What about nostr?

Nostr seems to me to be a more promising protocol than activitypub.

However, in terms of whether it will spread or not, I don't think it will spread that much.

Bluesky and atproto have a clear responsibility and it is easy to see who is running it. They are in an environment where spam is excluded. Conversely, I think that environments where this is not clear are more likely to be full of spam. Such things are dealt with individually by the administrators of the relay servers, and I think that some servers do not receive spam. However, from the perspective of the average person, it is incomprehensible. I also ask, "Where is that?"

This type of nature is sometimes called lawlessness, disorder, and irresponsible decentralization, and I think that ordinary people do not want to live there.

It is not that difficult to create such a place on the Internet. However, with the history of the search engine's decline, it did not work. That is why what do we do, how do we create order and maintain it? People have been thinking about this for many years and searching for a solution.

I think that many people are looking for a well-balanced order.

For example, a world where all individuals are independent and self-reliant and can do anything on their own. In a world where all residents have a stable mind, no arguments or troubles, no one does anything wrong, and everyone lives by themselves, it is strange to have rules, laws, administrators, or governments. Because there is no need for such things. At this stage, a lawless zone is correct.

However, I think it will be difficult to spread such things at this stage.

### The Limits of Names

Humans have always used names instead of numbers. For example, programming languages ​​also convert names into numbers. This is because names are easier for humans to read and write. Therefore, names are important.

Now let's think about names.

I feel that the current Internet has limitations in names.

The current Internet is a service where information exchange is completed within the service, for example, information exchange is completed within Twitter, Facebook, and YouTube. In order to enable these to exchange with each other, it is necessary to adopt the same protocol.

It was my prediction that in the future Internet, services will be able to exchange with each other.

And here I think that we will move towards that future for two reasons, one of which is because there are limitations to names.

Although names are running out for each service, there are many new people and companies that will be born in the future. They will be the ones who will set the trend in information in the future. Without them, growth cannot be expected.

However, new people cannot use the name they want because it is already taken. So, will these people be convinced and seriously interested in using the service? If so, I think they will go elsewhere.

In other words, I think that the problem will naturally move in a direction that solves it, and I think that will be the `domain` format.

In the future, the names people use will be in domain format, because (1) the names for each service are running out, and (2) unless the name is in domain format, it will be impossible to communicate with outside the service. And I predict that in the future of the Internet, it will become common to use multiple services with one account.

Since otocol is not something that users are aware of, I want it to be distributed internally and the difficult parts to be done in the background.

In other words, it must be easy to understand even for first-time users. And it must be directly linked to results.

Results are like "searching and getting results." In the case of SNS, it means "connecting without being aware of the server."

This is difficult with activitypub. Since it comes from the core of the technology, I think it is difficult to solve and is fatal.

Also, you need to set up a server to use your own name.

|protocol|user|body|
|---|---|---|
|activitypub://|@syui@syui.ai|You need to set up a server|
|at://|@syui.ai|You can set it up without setting up a server and it's short|

I especially like the `at://` part, it's short, concise, and meaningful.

### How about nostr

Nostr seems to me a more promising protocol than activitypub.

However, in terms of whether it will spread or not, I don't think it will spread that much.

Bluesky and atproto have a clear responsibility and it is easy to see who is running them. They are in an environment where spam is excluded. Conversely, I think that environments where this is not clear are more likely to be full of spam. Such things are dealt with individually by the administrators of the relay servers, and I think that some servers do not receive spam. However, from the perspective of the average person, it is incomprehensible. I also ask, "Where is that?"

This type of nature is sometimes called lawlessness, disorder, and irresponsible decentralization, and I don't think ordinary people would want to live there.

It is not that difficult to create such a place on the Internet. However, with the history of the search engine's decline, it did not work. That is why what do we do, how do we create order and maintain it? People have been thinking about this for many years and searching for a solution.

I think that many people are looking for a well-balanced order.

For example, a world where all individuals are independent and self-reliant and can do anything on their own. In a world where all residents have a stable mind, no arguments or troubles, no one does anything wrong, and everyone lives by themselves, it is strange to have rules, laws, administrators, or governments. Because there is no need for such things. At this stage, a lawless zone is correct.

However, I think it will be difficult to spread such things at this stage.

### The Limits of Names

Humans have always used names instead of numbers. For example, programming languages ​​also convert names into numbers. This is because names are easier for humans to read and write. Therefore, names are important.

Now let's think about names.

I feel that the current Internet has limitations in names.

The current Internet is a service where information exchange is completed within the service, for example, information exchange is completed within Twitter, Facebook, and YouTube. In order to enable these to exchange with each other, it is necessary to adopt the same protocol.

It was my prediction that in the future Internet, services will be able to exchange with each other.

And here I think that we will move towards that future for two reasons, one of which is because there are limitations to names.

Although names are running out for each service, there are many new people and companies that will be born in the future. They will be the ones who will set the trend for information in the future. Without them, growth cannot be expected.

However, new people cannot use the name they want because it is already taken. So, will these people be convinced and seriously interested in using the service? If so, I think they will go elsewhere.

In other words, I think that the problem will naturally move in a direction that solves it, and I think that this will be in the form of a `domain`.

In the future, the names people use will be in domain format, because (1) the names for each service are running out, and (2) unless the name is in domain format, it will be impossible to communicate with outside the service. And I predict that in the future, the Internet will change to a format where it is common to use multiple services with one account.

### Spreading

The most important thing about protocols is to spread them to many people.

This is important not only for protocols, but the more fundamental the technology becomes, the more the one who spreads it will win.

It is easier to understand the more fundamental part if you think of it in terms of the time people spend on it.

What do people spend the most time on in a day? The answer is computers.

Therefore, the company that develops and provides the most widely used OS will dominate.

This is also easy to understand if you think about it in terms of market capitalization. These are Microsoft (Windows) and Apple (Mac/iOS).

Recently, AI has been consuming (reducing) a huge amount of time, so Nvidia (GPU) has come to have a huge market capitalization.

Looking at human history, spreading is the most valuable thing.

For example, spreading one's own story is called religion. The dollar, the world's most widely used currency and base currency, also has great power. The same goes for language. The influence of English is immeasurable.

### The same thing will never spread

Right now, I often play a game called Genshin.

Normally, people would think that it would be good to make a game like Genshin, but I don't think that's enough. Even if you make something of the same or better quality, it will be difficult. Because Genshin already exists.

In other words, it's not enough to just copy something.

I've been into vtubers lately and watching their videos. But I thought it would be tough to start vtubing now. I feel that the people who benefit from vtubers are those who have been doing it since before the concept didn't exist, not those who are just starting out.

It's already too late to copy what's popular now or try to get involved. If I'm going to do something, I think I have to make something completely different, even if I'm into Genshin or vtubers.

### What do people find fun?

When I thought about what kind of game I should make, the answer was "to entertain people."

But I think there's a limit to how much I can do to make a fun game by myself.

So what we need to think about are people who are already "entertaining people."

If we connect the game to vtubers who are entertaining the viewers, we can spread both the game and the person at the same time.

And now, the hurdles to becoming a vtuber are high, and there's too much to do.

For example, you have to prepare a 3D model, open a Twitter account, choose a game to play, set up a live environment, open a YouTube channel, and display your username, account, and model on the screen. You also need a voice environment, and you have to operate the game while talking and operate the live screen.

I thought it would be nice if I could integrate all of this.

What do people find fun? Let's think about it again from the basics.

In previous games, the player became the protagonist of the game and relived the story. That's the case with my favorite games. For example, in Genshin Impact, there are two protagonists, Hotaru and Sora, and it's their story.

But don't you think you really want to play the story of the protagonist yourself? What do players really want?

There are already games that are thought of in this direction, for example, there are games where you start by remaking your character and customizing the protagonist yourself.

But I don't play those kinds of games very often. I don't know how to customize it, it's troublesome, and even if I customize it, it doesn't feel right. That's why I don't play many "make it yourself" type games. I prefer games where the characters are made from the beginning, like Genshin Impact.

As expected, customization is hard to do at first. It's hard to understand and it's troublesome. I think the most important thing is to be able to start right away.

So what about this case? For example, if you could control a character designed by yourself in Genshin, I would definitely enjoy playing it. I think you would be able to get attached to that character. Voice actors also play Genshin, and it was impressive to see them enjoying the characters using their own voices.

In other words, if more players could have this kind of experience, the game would surely become more fun.

What is needed to achieve this? One of them is uniqueness.

### Uniqueness of the player

In this game, we aim to give each player uniqueness. In other words, we design the game to ensure the uniqueness of the player.

How do we achieve this? I will tell you what we are thinking now.

- The characters that can be used will be unique to the player. They have unique skills that only that player can use.
- There is one pickup period per character. Characters drawn from gacha cannot use unique skills.

Each character is assigned one attribute. The assigned character has a group, which changes with each season. Attributes are different for each group. And they will not return to the previous season.

The first group planned is `fantasy`, followed by `animal`. Fantasy can handle one of the `atomic` attributes. Animal is one of the `molecular` attributes.

For example, the character Dragon in Season 1 has the attribute `atomic` and is in the fantasy group. Fantasy includes phoenixes and pegasuses, while animals include whales and lions. The season in which you start the game determines the character you are initially assigned to.

```json
$ cat ue.json|jq ".[]|{atom,molecule}"
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
        "ja": "アトムはギリシャ語のアトモス、これ以上分割できないという単語が由来。原子は陽子と中性子からなる原子核と、その周囲に分布する電子から構成される"
      }
    },
    "enum": [
      "proton",
      "neutron",
      "atomic",
      "electron",
      "quark"
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
      "water",
      "wind",
      "rock",
      "ice",
      "fire"
    ]
  }
}
```

Let's keep going. Next we'll explain evolution. Each character has a `model : You can evolve from animal -> human -> divinity. You can change forms (switch) between each model in the game.

- animal -> human -> divinity

![](https://git.syui.ai/ai/ue/raw/branch/main/verse/img/shinka.png)

### Choices should come first

The game is made up of three elements: choices, diagnosis, and fate.

- choices -> diagnosis -> fate

I think the choice element should come first. Let's apply this to the case of creating an account, for example.

1. Select the gender of the character
2. The character is determined by the diagnosis
3. Status is assigned randomly (9:1), meaning that the player is assigned randomly (9:1).

There are many games where you choose your gender at the beginning, and I think that has an important meaning. One reason is that it makes the player understand that they have the right to choose the game.

### Let's go to the atmosphere

<!--
<video src="" width="100%" height="500px"></video>
-->

To post to `atproto` with `blueprint`, do the following. Use `Content-Type:x_www_from_urlencoded_url`.

<iframe src="https://blueprintue.com/render/4yf7viyt/" width="100%" height="400px"></iframe>

- plugin : [varset](https://github.com/ufna/VaRest)
