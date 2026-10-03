import type { ClusterEntry } from "@/lib/cluster";

/**
 * Cluster 22 entries — audio coaching: spoken cues, tones and ducking during a
 * workout.
 *
 * Written against the session fact pack (Apple and Google developer
 * documentation fetched 2026-10-03) and checked before assembly: every
 * internal link against the route list, every quoted span against the fact
 * pack, FAQ uniqueness across every page on the site, and title and
 * description lengths. Hand-editing is expected, as in every cluster.
 *
 * Order is the hub's reading order, so prev/next walks the cluster the way it
 * is meant to be read: the iOS session first, then what interrupts it, then
 * Android, then the wrist and testing.
 */
export const audioCoachingEntries: ClusterEntry[] =
[
  {
    "slug": "avaudiosession-category-workout-app",
    "primaryQuery": "avaudiosession category for workout app",
    "h1": "playback or ambient: choosing the AVAudioSession category for workout cues",
    "metaTitle": "AVAudioSession playback vs ambient for Workout Cues",
    "metaDescription": "Apple's default session silences the user's music and goes quiet on lock. Which category and mode let a workout cue play over music with the screen off.",
    "updated": "2026-10-03",
    "answer": "The audio session category decides whether a workout cue survives the screen locking and whether it stops the user's music. Apple documents that the default category, soloAmbient, silences other background audio when your app plays and is itself silenced by screen locking and the Silent switch, and that ambient mixes with other apps but is silenced the same way. The playback category keeps playing through the Silent switch and the lock, and needs the audio value in UIBackgroundModes to continue in the background, but Apple says it is nonmixable by default, so on its own it interrupts the user's music. For cues that must be heard mid-workout, that points to playback with a mixing option such as duckOthers, plus the voicePrompt mode when the cue is synthesized speech.",
    "body": "The first audio bug most workout apps ship is not in their own code. It is in the session they never configured. The cue works on a desk with the screen on, then goes silent on the first run with the phone in an armband, or it plays and the user's music stops dead. Both are the documented behaviour of the category the app is using, usually the one it got by default.\n\nThis page is about choosing that category and mode. Lowering the user's music while a cue plays is the next page, [duckOthers and notifyOthersOnDeactivation](/audio-coaching/avaudiosession-duckothers-workout-cues); keeping the app allowed to play after the screen locks is [UIBackgroundModes audio](/audio-coaching/background-audio-workout-app-ios).\n\n## The default you are already shipping\n\nApple's [AVAudioSession overview](https://developer.apple.com/documentation/avfaudio/avaudiosession) lists what every iOS app gets before it touches the session. It \"supports audio playback, but disallows audio recording.\" When the app plays audio, \"it silences any other background audio.\" In iOS, \"setting the Ring/Silent switch to silent mode silences any audio the app is playing,\" and \"locking a device silences the app's audio.\"\n\nRead that list as a workout app. The user starts their music, starts your workout, locks the phone and puts it away. Under the default session, your first cue silences their music, and every cue after the lock is silenced. Apple's verdict on the default is polite: it \"generally doesn't provide the audio behavior a media app needs.\"\n\nThe default has a name. Apple documents [`soloAmbient`](https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/soloambient) as \"The default audio session category,\" whose audio \"is silenced by screen locking and by the Silent switch,\" and which \"implies that your app's audio is nonmixable—activating your session will interrupt any other audio sessions which are also nonmixable.\"\n\n## The four categories a workout app considers\n\n| Category | Apple's one-line description | Mixes with the user's music | Silent switch | Screen lock |\n| --- | --- | --- | --- | --- |\n| `soloAmbient` (default) | The default audio session category | No, nonmixable by default | Silences it | Silences it |\n| `ambient` | Sound playback is nonprimary; the app also works with the sound turned off | Yes, other apps' audio mixes with yours | Silences it | Silences it |\n| `playback` | Recorded music or other sounds that are central to the successful use of your app | No by default; add `mixWithOthers` | Keeps playing | Keeps playing, with the background mode |\n| `playAndRecord` | Recording and playback, such as a VoIP app | No by default; add `mixWithOthers` | Keeps playing | Keeps playing, with the background mode |\n\nEach cell is from Apple's category pages. [`ambient`](https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/ambient): \"audio from other apps mixes with your audio. Screen locking and the Silent switch (on iPhone, the Ring/Silent switch) silence your audio.\" [`playback`](https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playback): \"your app audio continues with the Silent switch set to silent or when the screen locks,\" and \"To continue playing audio when your app transitions to the background (for example, when the screen locks), add the `audio` value to the UIBackgroundModes key in your information property list file.\" [`playAndRecord`](https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playandrecord) adds that \"The user must grant permission for audio recording,\" which is a permission prompt no cue-only app should trigger.\n\nApple's [Playing audio guidelines](https://developer.apple.com/design/human-interface-guidelines/playing-audio) give the same split in design terms: ambient is for when sound \"isn't essential, and it doesn't silence other audio\"; playback is for when sound \"is essential and might mix with other audio,\" and it \"Can play in the background.\"\n\n## Why ambient is tempting and usually wrong\n\n`ambient` looks like exactly what a polite workout app wants. It mixes with the user's music without being asked, so there is no ducking to configure and no option to get wrong. For a cue that is genuinely optional, that is a fine choice: a metronome tick while the app is open, a celebratory sound on the summary screen.\n\nThe problem is the moment the cue exists for. A rest-over cue matters most when the phone is locked in a pocket, and Apple documents that screen locking silences an `ambient` session. That is not a bug you can work around inside the category; it is the category's definition. Our judgement: if a cue has to be heard with the screen off, it cannot live in `ambient`.\n\n## Why playback is right and has one trap\n\n`playback` keeps going through the Silent switch and the lock, which is what a coaching cue needs. The trap is the sentence that follows on Apple's page: \"By default, using this category implies that your app's audio is nonmixable—activating your session will interrupt any other audio sessions which are also nonmixable. To allow mixing for this category, use the mixWithOthers option.\"\n\nSo a workout app that sets `.playback` and nothing else has traded one bug for another: instead of going silent when the phone locks, it now stops the user's music every time it speaks. The fix is a category option. Apple documents three that matter here, and two of them imply the third:\n\n- [`mixWithOthers`](https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/mixwithothers): \"If you set this option, your app mixes its audio with audio playing in background apps, such as the Music app.\" Apple notes that setting `duckOthers` or `interruptSpokenAudioAndMixWithOthers` \"also enables this option.\"\n- `duckOthers` lowers the other audio while yours plays.\n- `interruptSpokenAudioAndMixWithOthers` pauses spoken audio, such as a podcast, instead of talking over it.\n\nThe last two are the subject of the [duckOthers page](/audio-coaching/avaudiosession-duckothers-workout-cues). Apple's guidelines put the principle plainly: \"don't make people stop listening to music from another app if you don't need to.\"\n\n## The mode: voicePrompt, not spokenAudio\n\nThe mode refines the category. Apple documents [`default`](https://developer.apple.com/documentation/avfaudio/avaudiosession/mode-swift.struct/default) as usable \"with every audio session category,\" and two spoken-audio modes that are easy to confuse:\n\n- [`voicePrompt`](https://developer.apple.com/documentation/avfaudio/avaudiosession/mode-swift.struct/voiceprompt): \"A mode that indicates that your app plays audio using text-to-speech.\" Apple says setting it \"allows for different routing behaviors when your app connects to certain audio devices, such as CarPlay,\" and that apps of this type \"also configure their sessions to use the duckOthers and interruptSpokenAudioAndMixWithOthers options.\"\n- [`spokenAudio`](https://developer.apple.com/documentation/avfaudio/avaudiosession/mode-swift.struct/spokenaudio): \"A mode used for continuous spoken audio to pause the audio when another app plays a short audio prompt,\" appropriate for \"podcasts or audio books.\"\n\n`spokenAudio` is the mode of the app you are interrupting, not yours. A coaching app that speaks short cues over the user's music is the \"short audio prompt\" in that sentence. If your app also plays long guided sessions, those are the continuous spoken audio, and the mode can differ between the two activities.\n\nApple scopes `voicePrompt` to text-to-speech. For cues recorded as audio files, Apple's page does not say whether the mode applies; our judgement is to use `default` for recorded clips and tones, and `voicePrompt` when the cue is synthesized speech, as on the [AVSpeechSynthesizer page](/audio-coaching/avspeechsynthesizer-workout-cues).\n\n```swift\nlet session = AVAudioSession.sharedInstance()\ntry session.setCategory(.playback,\n                        mode: .voicePrompt,\n                        options: [.duckOthers, .interruptSpokenAudioAndMixWithOthers])\n```\n\nApple's [`setCategory(_:mode:options:)`](https://developer.apple.com/documentation/avfaudio/avaudiosession/setcategory(_:mode:options:)) page says you \"Typically\" set the category and mode \"before activating the session,\" and that setting them while active \"results in an immediate change.\" Configure once, at workout start, and do not activate yet: Apple's overview notes it is \"generally preferable to defer this call until your app begins audio playback,\" which \"ensures that you won't prematurely interrupt any other background audio that may be in progress.\"\n\n## Knowing whether the user already has music on\n\nMany workout apps ship their own music bed under the coaching. When the user starts their own music, the bed should get out of the way and the cues should stay. Apple documents exactly this split for games.\n\n[`secondaryAudioShouldBeSilencedHint`](https://developer.apple.com/documentation/avfaudio/avaudiosession/secondaryaudioshouldbesilencedhint) is \"A Boolean value that indicates whether another app, with a nonmixable audio session, is playing audio,\" to be used \"as a hint to silence audio that's secondary to the functionality of the app.\" Apple's example: a game \"can use this property to mute the soundtrack while leaving sound effects unmuted.\" Swap soundtrack for music bed and sound effects for cues.\n\nApple steers you to it over [`isOtherAudioPlaying`](https://developer.apple.com/documentation/avfaudio/avaudiosession/isotheraudioplaying), which \"returns true if any other audio is playing, including audio from an app using the ambient category.\" For change events, [`silenceSecondaryAudioHintNotification`](https://developer.apple.com/documentation/avfaudio/avaudiosession/silencesecondaryaudiohintnotification) is posted \"when the primary audio from other apps starts and stops,\" but only \"to registered listeners who are currently in the foreground and have an active audio session,\" so re-read the hint when the app returns to the foreground rather than relying on the notification alone.\n\n## The Silent switch question\n\nApple's guidelines describe what silent mode means to the person who flips it: \"When a device is in silent mode, it plays only the audio that people explicitly initiate, like media playback, alarms, and audio/video messaging.\" A `playback` session plays through the switch. Whether a workout cue counts as audio the person explicitly initiated is a product decision Apple's text does not make for you. Our judgement: starting a workout with voice cues switched on is an explicit request, and a setting that turns cues off, paired with [haptics as the fallback channel](/accessibility/haptics-when-audio-is-busy), respects the person who wants silence.\n\n## Monday morning\n\nFind where your app first touches `AVAudioSession`. If the answer is nowhere, you are on `soloAmbient` and every symptom above is expected. Set `.playback` with a mixing option at workout start, choose `voicePrompt` for synthesized speech and `default` for clips, defer activation until the first cue, and add the `audio` background mode. Then lock the phone with music playing and listen to one full interval.",
    "faqs": [
      {
        "q": "Why does my workout cue go silent when the iPhone screen locks?",
        "a": "Because the category your app is using is silenced by the lock. Apple documents that the default category, soloAmbient, is silenced by screen locking and by the Silent switch, and the ambient category is silenced the same way. The playback category is the one Apple documents as continuing when the screen locks, and Apple's playback page adds that continuing in the background also requires the audio value in the UIBackgroundModes key of your Info.plist. Without both, a cue that works on your desk with the screen on will stop as soon as the phone goes into a pocket."
      },
      {
        "q": "Does the AVAudioSession playback category stop the user's music?",
        "a": "It does by default. Apple's playback page says the category implies your audio is nonmixable, so activating your session interrupts any other nonmixable session, which is how most music playback is configured. To keep the music playing, add a mixing option: mixWithOthers mixes your audio with theirs, and duckOthers lowers their volume while yours plays and, per Apple, implicitly sets mixWithOthers. Apple's design guidance says not to make people stop listening to music from another app if you don't need to, and a workout cue never needs to."
      },
      {
        "q": "Should a workout app use the spokenAudio mode or voicePrompt?",
        "a": "voicePrompt, for synthesized cues. Apple documents spokenAudio for continuous spoken audio such as podcasts or audio books, where your app should pause rather than duck when another app plays a short prompt. A coaching cue is that short prompt, not the podcast. Apple describes voicePrompt as indicating that your app plays audio using text-to-speech, and says apps of that type typically also set duckOthers and interruptSpokenAudioAndMixWithOthers. Apple scopes voicePrompt to text-to-speech, so for recorded clips and tones our choice is the default mode."
      },
      {
        "q": "How can an iOS workout app tell whether the user is already playing their own music?",
        "a": "Read secondaryAudioShouldBeSilencedHint. Apple describes it as indicating whether another app with a nonmixable audio session is playing audio, and recommends it over isOtherAudioPlaying, which also counts audio from ambient-category apps. Apple's example is a game muting its soundtrack while keeping sound effects; for a workout app that is muting your own music bed while keeping the coaching cues. Apple's change notification for this hint is only delivered to apps in the foreground with an active session, so re-read the property when the app returns to the foreground."
      }
    ],
    "related": [
      {
        "href": "/audio-coaching/avaudiosession-duckothers-workout-cues",
        "label": "duckOthers and notifyOthersOnDeactivation"
      },
      {
        "href": "/audio-coaching/background-audio-workout-app-ios",
        "label": "UIBackgroundModes audio for workout apps"
      },
      {
        "href": "/build/hiit-app",
        "label": "How to build a HIIT app"
      },
      {
        "href": "/build/meditation-app",
        "label": "How to build a meditation app"
      },
      {
        "href": "/accessibility/haptics-when-audio-is-busy",
        "label": "Haptics when the audio channel is busy"
      }
    ],
    "cta": {
      "pitch": "Apple keeps changing AVAudioSession, most recently with new lifecycle notifications in iOS 27. Our newsletter flags the audio changes that reach a workout app's cues."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession",
        "checked": "2026-10-03",
        "note": "default session behaviour; deferring activation"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playback",
        "checked": "2026-10-03",
        "note": "playback category, Silent switch, lock, UIBackgroundModes, nonmixable default"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/ambient",
        "checked": "2026-10-03",
        "note": "ambient mixes; silenced by lock and Silent switch"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/mode-swift.struct/voiceprompt",
        "checked": "2026-10-03",
        "note": "voicePrompt mode for text-to-speech"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/secondaryaudioshouldbesilencedhint",
        "checked": "2026-10-03",
        "note": "hint to silence secondary audio"
      },
      {
        "url": "https://developer.apple.com/design/human-interface-guidelines/playing-audio",
        "checked": "2026-10-03",
        "note": "category table; silent mode; don't stop other music"
      }
    ]
  },
  {
    "slug": "avaudiosession-duckothers-workout-cues",
    "primaryQuery": "avaudiosession duckothers",
    "h1": "duckOthers: lowering the user's music for a workout cue, then giving it back",
    "metaTitle": "AVAudioSession duckOthers: Lower Music for Workout Cues",
    "metaDescription": "duckOthers works only with playback, playAndRecord or multiRoute, lasts while your session is active, and Apple says use it for a few seconds at most.",
    "updated": "2026-10-03",
    "answer": "duckOthers is the AVAudioSession category option that, in Apple's words, reduces the volume of other audio sessions while audio from your session plays. Apple documents that it can be set only with the playAndRecord, playback or multiRoute category, that ducking begins when you activate your session and ends when you deactivate it, and that it should be used on a temporary basis only, never to duck other apps for more than a few seconds. For an exercise app Apple says to also set interruptSpokenAudioAndMixWithOthers, which pauses podcast-style spoken audio instead of talking over it. So activate the session immediately before each cue and deactivate it with notifyOthersOnDeactivation once the cue has finished, which lets the music return to full volume and a paused podcast resume.",
    "body": "\"Duck, don't stop\" is the requirement every workout app writes down. On iOS it is one option, `duckOthers`, plus a rule about timing that the option's name does not mention and most first implementations break: the ducking lasts exactly as long as your audio session is active. Activate at workout start and the user's music sits at reduced volume for forty minutes.\n\nThis page assumes the session is already in the `playback` category; choosing it is [the category page](/audio-coaching/avaudiosession-category-workout-app). The Android equivalent is [AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK](/audio-coaching/android-audio-focus-may-duck).\n\n## What Apple says duckOthers does\n\nApple's [`duckOthers`](https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/duckothers) page, in full on the parts that matter:\n\n- \"An option that reduces the volume of other audio sessions while audio from this session plays.\"\n- \"You can set this option only if the audio session category is playAndRecord, playback, or multiRoute. Setting it implicitly sets the mixWithOthers option.\"\n- \"If your app provides occasional spoken audio, such as in a turn-by-turn navigation app or an exercise app, you should also set the interruptSpokenAudioAndMixWithOthers option.\"\n- \"Ducking begins when you activate your app's audio session and ends when you deactivate the session. If you clear this option, activating your session interrupts other audio sessions.\"\n- Marked important: \"Set this option on a temporary basis only. Don't use it to duck the audio of other apps for more than a few seconds.\"\n\nApple names exercise apps by type. That makes this one of the few places where a platform vendor tells a fitness developer exactly which options to set.\n\n## The rule that shapes your architecture\n\nThe fourth bullet is the one that matters. Ducking is not tied to your sound playing; it is tied to your session being active. So the unit you manage is the activation window, and the window should wrap the cue and nothing else.\n\n```swift\nlet session = AVAudioSession.sharedInstance()\n\n// Once, at workout start. Do not activate yet.\ntry session.setCategory(.playback,\n                        mode: .voicePrompt,\n                        options: [.duckOthers, .interruptSpokenAudioAndMixWithOthers])\n\n// Immediately before each cue.\ntry session.setActive(true)\n// ... play the cue ...\n\n// After the cue has finished playing.\ntry session.setActive(false, options: .notifyOthersOnDeactivation)\n```\n\nThree timing mistakes produce three different symptoms:\n\n| What the code does | What the user hears | Why |\n| --- | --- | --- |\n| Activates once at workout start | Music quiet for the whole workout | Ducking begins at activation and ends at deactivation |\n| Deactivates before the cue finishes | The end of the cue cut off | Apple: deactivating with running audio objects stops the objects |\n| Never deactivates | Music stays quiet after the last cue | Nothing ended the ducking |\n\nThe second row comes from Apple's [`setActive(_:options:)`](https://developer.apple.com/documentation/avfaudio/avaudiosession/setactive(_:options:)) page: \"Deactivating an audio session with running audio objects stops the objects, makes the session inactive, and returns an AVAudioSession.ErrorCode.isBusy error.\" The session does go inactive, so the music comes back, but your cue is truncated and you get an error that looks like a failure to deactivate. Deactivate from the player's or synthesizer's completion callback, not from a timer you hope is long enough.\n\n## Music is ducked; podcasts are paused\n\n`duckOthers` alone talks over whatever is playing. That works for music. Over a podcast or an audiobook it produces two voices at once, which is why Apple pairs it with a second option.\n\nApple's [`interruptSpokenAudioAndMixWithOthers`](https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/interruptspokenaudioandmixwithothers) page: \"the system mixes your audio with other audio sessions, but interrupts (and stops) audio sessions that use the spokenAudio audio session mode. It pauses the audio from other apps as long as your session is active. After your audio session deactivates, the system resumes the interrupted app's audio.\" And: \"Set this option if your app's audio is occasional and spoken, such as in a turn-by-turn navigation app or an exercise app. This avoids intelligibility problems when two spoken audio apps mix. If you set this option, also set the duckOthers option unless you have a specific reason not to.\"\n\n| What the user is playing | `duckOthers` only | `duckOthers` + `interruptSpokenAudioAndMixWithOthers` |\n| --- | --- | --- |\n| Music | Lowered while your session is active | Lowered while your session is active |\n| A podcast app using the spokenAudio mode | Lowered; two voices at once | Paused while your session is active, resumed after you deactivate with notification |\n| Nothing | Your cue plays | Your cue plays |\n\nThe middle-right cell depends on the podcast app having declared [`spokenAudio`](https://developer.apple.com/documentation/avfaudio/avaudiosession/mode-swift.struct/spokenaudio), which Apple describes as indicating the app \"should pause, rather than duck, its audio if another app plays a spoken audio prompt.\" You cannot control what other apps declare, so test against the podcast apps your users actually run.\n\n## notifyOthersOnDeactivation: the podcast that never comes back\n\nThe paused podcast resumes only if you tell the system you are done. Apple's option page says so directly: \"When you configure your audio session category using this option, notify other apps on the system when you deactivate your session so that they can resume audio playback. To do so, deactivate your session using the notifyOthersOnDeactivation option.\"\n\n[`notifyOthersOnDeactivation`](https://developer.apple.com/documentation/avfaudio/avaudiosession/setactiveoptions/notifyothersondeactivation) \"indicates that when your audio session deactivates, other audio sessions that had been interrupted by your session can return to their active state,\" and Apple adds: \"Only use this option when deactivating your audio session.\" Apple's [Playing audio guidelines](https://developer.apple.com/design/human-interface-guidelines/playing-audio) make it a design rule: \"If your app can temporarily interrupt the audio of other apps, be sure to flag your audio session in a way that lets other apps know when they can resume.\"\n\nIf users report that their podcast stops at the first cue and stays stopped, look for a `setActive(false)` without this option.\n\n## How long is a few seconds\n\nApple writes \"more than a few seconds\" and gives no number, so neither do we. What follows is our judgement about applying it to coaching:\n\n- A single cue (\"rest, thirty seconds\", \"last rep\") is one window.\n- A countdown (\"three, two, one, go\") is one window, not four. Re-activating for every word ducks and un-ducks the music in a stutter, and each activation is another chance to fail.\n- A long explanation of the next exercise is not a cue. If it runs for more than a sentence or two, it belongs in a guided-session flow where pausing the user's music, with their consent, is the honest behaviour, rather than holding a duck past what Apple calls temporary.\n\n## When activation fails\n\nActivation can fail, and a cue path that assumes it cannot will hang. Apple's `setActive(_:options:)` page: \"The session fails to activate if another audio session has higher priority than yours (such as a phone call) and neither audio session allows mixing.\" A ducking session is mixable, because `duckOthers` sets `mixWithOthers`, but the call can still throw, and during a call or Siri you probably should not speak anyway; [promptStyle](/audio-coaching/avspeechsynthesizer-workout-cues) is the documented signal for that. Our judgement: when activation throws, skip the spoken cue, fire the haptic, keep the workout clock running, and log it.\n\n## Monday morning\n\nSearch the codebase for `setActive(true)`. Every call should sit immediately before a cue, and every cue should end in `setActive(false, options: .notifyOthersOnDeactivation)` called from a completion callback. Add `interruptSpokenAudioAndMixWithOthers` next to `duckOthers`. Then run one interval with music playing and one with a podcast playing, and listen for whether each comes back.",
    "faqs": [
      {
        "q": "Why does the user's music stay quiet after my workout cue finishes?",
        "a": "Because your audio session is still active. Apple documents that duckOthers ducking begins when you activate your session and ends when you deactivate it, so the volume comes back only when you call setActive with false. Apps that activate the session once at workout start keep the music ducked for the whole workout. Apps that never deactivate keep it ducked after the last cue. Deactivate from the cue's completion callback, using the notifyOthersOnDeactivation option so that any other app you interrupted is told it can resume."
      },
      {
        "q": "Can I keep duckOthers active for a whole workout?",
        "a": "Apple says not to. The duckOthers documentation marks it as important to set the option on a temporary basis only and not to use it to duck the audio of other apps for more than a few seconds. Because ducking lasts exactly as long as your session is active, the practical pattern is to activate right before a cue and deactivate right after it. Apple gives no number for a few seconds, and neither do we. Our rule is that one cue, or one countdown, is one activation window."
      },
      {
        "q": "What does interruptSpokenAudioAndMixWithOthers do to a podcast the user is playing?",
        "a": "It pauses it while your cue plays, then lets it resume. Apple documents that with this option the system mixes your audio with other sessions but interrupts and stops sessions that use the spokenAudio mode, pausing them as long as your session is active, and resuming the interrupted app's audio after your session deactivates. Apple tells apps using it to deactivate with notifyOthersOnDeactivation so other apps can resume, and recommends setting duckOthers alongside it, since ducking is appropriate when the other audio is not spoken."
      },
      {
        "q": "Why does deactivating my audio session return an isBusy error?",
        "a": "Because audio was still playing when you deactivated. Apple's setActive(_:options:) documentation says deactivating a session with running audio objects stops the objects, makes the session inactive, and returns AVAudioSession.ErrorCode.isBusy. The session does deactivate, so the other app's music comes back, but your cue is cut off. Deactivate from the player's or speech synthesizer's completion callback instead of from a timer that guesses how long the cue lasts."
      }
    ],
    "related": [
      {
        "href": "/audio-coaching/avaudiosession-category-workout-app",
        "label": "Choosing the AVAudioSession category"
      },
      {
        "href": "/audio-coaching/android-audio-focus-may-duck",
        "label": "The Android equivalent: MAY_DUCK"
      },
      {
        "href": "/audio-coaching/avspeechsynthesizer-workout-cues",
        "label": "Spoken cues with AVSpeechSynthesizer"
      },
      {
        "href": "/build/hiit-app",
        "label": "How to build a HIIT app"
      },
      {
        "href": "/accessibility/haptics-when-audio-is-busy",
        "label": "Haptics when the audio channel is busy"
      }
    ],
    "cta": {
      "pitch": "Ducking behaviour is the part of a workout app users notice first. We track the Apple and Android audio changes that alter it, so you hear about them before your reviews do."
    },
    "steps": [
      {
        "name": "Configure once, without activating",
        "text": "At workout start, call setCategory with the playback category, the voicePrompt mode for synthesized speech, and the duckOthers and interruptSpokenAudioAndMixWithOthers options. Apple notes it is generally preferable to defer activation until playback begins."
      },
      {
        "name": "Activate immediately before the cue",
        "text": "Call setActive(true) right before the cue plays. Apple documents that ducking begins when you activate your session, so this is the moment the user's music lowers."
      },
      {
        "name": "Play the cue and wait for completion",
        "text": "Play the clip or utterance and wait for its completion callback. Apple documents that deactivating with running audio objects stops them and returns an isBusy error."
      },
      {
        "name": "Deactivate and notify others",
        "text": "Call setActive(false, options: .notifyOthersOnDeactivation). Ducking ends at deactivation, and the option lets any app you interrupted, such as a paused podcast, return to its active state."
      }
    ],
    "sources": [
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/duckothers",
        "checked": "2026-10-03",
        "note": "categories allowed, implicit mixWithOthers, activation window, few seconds"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/interruptspokenaudioandmixwithothers",
        "checked": "2026-10-03",
        "note": "pausing spokenAudio sessions; exercise apps; notify on deactivation"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/setactiveoptions/notifyothersondeactivation",
        "checked": "2026-10-03",
        "note": "letting interrupted sessions return"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/setactive(_:options:)",
        "checked": "2026-10-03",
        "note": "isBusy on deactivation with running audio objects; activation failure"
      },
      {
        "url": "https://developer.apple.com/design/human-interface-guidelines/playing-audio",
        "checked": "2026-10-03",
        "note": "let other apps know when temporary audio finishes"
      }
    ]
  },
  {
    "slug": "avspeechsynthesizer-workout-cues",
    "primaryQuery": "avspeechsynthesizer workout cues",
    "h1": "Spoken workout cues with AVSpeechSynthesizer, and when to stay quiet",
    "metaTitle": "AVSpeechSynthesizer Workout Cues and promptStyle",
    "metaDescription": "Retain the synthesizer, cancel stale cues with stopSpeaking(at:), pick usesApplicationAudioSession, and obey promptStyle, which names exercise prompts.",
    "updated": "2026-10-03",
    "answer": "AVSpeechSynthesizer speaks AVSpeechUtterance objects from a queue, and three documented details decide whether it works for workout cues. Apple notes the system doesn't automatically retain the synthesizer, so keep a reference for the whole workout, and because it speaks queued utterances in order, a cue that has gone stale must be cancelled with stopSpeaking(at:), which removes all unspoken utterances, rather than left to play late. usesApplicationAudioSession decides who handles ducking: set to false, Apple says the system creates a separate session that manages speech, interruptions, mixing and ducking for you. Apple also publishes promptStyle for voice-prompt apps, naming exercise prompts, which tells you when to speak, when to use a short nonverbal prompt, and when not to prompt at all.",
    "body": "Synthesized speech is the cheapest way to give a workout app a voice: no recording sessions, every number and exercise name available on demand, every language the device has a voice for. It is also where the documented details bite hardest, because a cue is time-critical in a way a read-aloud article is not. \"Rest over\" spoken four seconds late is worse than silence.\n\nThis page covers `AVSpeechSynthesizer` and `AVSpeechUtterance` for coaching cues, and the `promptStyle` hint Apple publishes for exactly this kind of prompt. The session configuration underneath it is on [the category page](/audio-coaching/avaudiosession-category-workout-app) and [the duckOthers page](/audio-coaching/avaudiosession-duckothers-workout-cues).\n\n## The object, and the bug everybody hits first\n\nApple's [`AVSpeechSynthesizer`](https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer) is \"An object that produces synthesized speech from text utterances and enables monitoring or controlling of ongoing speech.\" You create an `AVSpeechUtterance` with the text and pass it to `speak(_:)`.\n\nThe note at the bottom of that page explains the most common first bug, a cue that never plays or stops early: \"The system doesn't automatically retain the speech synthesizer, so you need to manually retain it until speech concludes.\" A synthesizer created as a local variable inside a cue function can go away before it speaks. Hold one synthesizer for the workout, as a property of whatever owns the cue schedule.\n\n```swift\nfinal class CueSpeaker: NSObject, AVSpeechSynthesizerDelegate {\n    private let synthesizer = AVSpeechSynthesizer()   // retained for the workout\n    private var lastUtterance: AVSpeechUtterance?\n\n    override init() {\n        super.init()\n        synthesizer.delegate = self\n    }\n\n    func say(_ text: String) {\n        let utterance = AVSpeechUtterance(string: text)   // a new utterance every time\n        lastUtterance = utterance\n        synthesizer.speak(utterance)\n    }\n}\n```\n\nThe comment on the utterance line is the second bug. Apple's [`speak(_:)`](https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/speak(_:)) page carries a warning: \"Attempting to enqueue the same utterance more than once throws an exception.\" Caching a \"Go!\" utterance and replaying it is a crash, not an optimisation.\n\n## It is a queue, and late cues have to be cancelled\n\nApple: \"The speech synthesizer maintains a queue of utterances that it speaks. If the synthesizer isn't speaking, calling speak(_:) begins speaking that utterance either immediately or after pausing for its preUtteranceDelay, if necessary. If the synthesizer is speaking, the synthesizer adds utterances to a queue and speaks them in the order it receives them.\"\n\nThat is right for reading an article and wrong for a workout. If a long cue about the next exercise is still playing when the interval ends, the \"go\" cue waits behind it, and arrives late. Our rule: a cue that is stale when its moment passes must be cancelled, not queued.\n\nApple's [`stopSpeaking(at:)`](https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/stopspeaking(at:)) is the tool: \"Unlike pausing a speech synthesizer, which can resume after a pause, stopping the synthesizer immediately cancels speech and removes all unspoken utterances from the synthesizer's queue.\" Its boundary argument, `AVSpeechBoundary`, has two cases, `.immediate` and `.word`, which Apple describes as choosing \"whether to stop speech immediately or only after the synthesizer finishes speaking the current word.\"\n\n```swift\n// The interval ended: anything still queued is now wrong.\nsynthesizer.stopSpeaking(at: .word)\nsynthesizer.speak(AVSpeechUtterance(string: \"Go\"))\n```\n\nOur judgement on the boundary: `.word` for a cue that is merely superseded, because a clipped syllable sounds like a fault; `.immediate` when the user paused the workout and expects silence now.\n\n## Who owns the audio session\n\nThis is the decision that determines whether the user's music ducks. Apple's [`usesApplicationAudioSession`](https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/usesapplicationaudiosession) is \"A Boolean value that specifies whether the app manages the audio session,\" and: \"If you set this value to false, the system creates a separate audio session to automatically manage speech, interruptions, and mixing and ducking the speech with other audio sources.\"\n\n| Setting | Who configures ducking | Fits |\n| --- | --- | --- |\n| `usesApplicationAudioSession = false` | The system, in a separate session it creates for speech | An app whose only audio is spoken cues, and which is happy with the system's choices |\n| Leave it on your app's session | You: category, `duckOthers`, activation window | An app that also plays tones, clips or a music bed and needs one consistent policy |\n\nApple's page documents what `false` does; it does not state the default, and we have not verified it, so set the property explicitly either way. If you keep your own session, the delegate callback below is where the activation window closes.\n\n## Finishing: the delegate callback that closes the window\n\n[`speechSynthesizer(_:didFinish:)`](https://developer.apple.com/documentation/avfaudio/avspeechsynthesizerdelegate/speechsynthesizer(_:didfinish:)) \"Tells the delegate when the synthesizer finishes speaking an utterance,\" with a detail worth knowing: \"The system ignores the final utterance's postUtteranceDelay and calls this method immediately when speech ends.\" That makes it the right moment to deactivate a ducking session and give the music back.\n\n```swift\nfunc speechSynthesizer(_ synthesizer: AVSpeechSynthesizer,\n                       didFinish utterance: AVSpeechUtterance) {\n    guard utterance === lastUtterance else { return }   // a later cue is still queued\n    try? AVAudioSession.sharedInstance()\n        .setActive(false, options: .notifyOthersOnDeactivation)\n}\n```\n\n## Utterance settings, and when they stop applying\n\nFrom Apple's [`AVSpeechUtterance`](https://developer.apple.com/documentation/avfaudio/avspeechutterance) reference:\n\n- `rate` is \"a decimal representation within the range of AVSpeechUtteranceMinimumSpeechRate and AVSpeechUtteranceMaximumSpeechRate,\" defaulting to `AVSpeechUtteranceDefaultSpeechRate`. \"Set this property before enqueing the utterance because setting it afterward has no effect.\"\n- `volume` runs from \"0.0 for silent to 1.0 for loudest volume,\" default 1.0, and setting it after enqueueing \"has no effect.\"\n- `voice`: \"If you don't specify a voice, the speech synthesizer uses the system's default voice.\" `AVSpeechSynthesisVoice(language:)` takes \"A BCP 47 code,\" and passing nil gives \"the default voice for the system's language and region.\"\n- `preUtteranceDelay` and `postUtteranceDelay`: with several utterances queued, the synthesizer \"pauses a minimum amount of time equal to the sum of the current utterance's postUtteranceDelay and the next utterance's preUtteranceDelay.\"\n- `prefersAssistiveTechnologySettings`: \"A Boolean that specifies whether assistive technology settings take precedence over the property values of this utterance.\" For a VoiceOver user with a speaking rate they chose, that is worth setting; the wider VoiceOver picture is on [the live-metrics page](/accessibility/voiceover-live-workout-metrics).\n- SSML: `init(ssmlRepresentation:)` returns nil \"if you pass an invalid SSML string,\" and Apple notes that properties affecting prosody, \"such as its rate and pitchMultiplier, don't apply to an utterance that uses an SSML representation.\"\n\nThe SSML note is a quiet trap: a team that moves cues to SSML for emphasis loses the user's speech-rate preference if it was applied through `rate`.\n\nApple also documents [`mixToTelephonyUplink`](https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/mixtotelephonyuplink), \"A Boolean value that specifies whether to send synthesized speech to an active call,\" which \"has no effect when there isn't an active call.\" Our judgement: a coaching cue has no business in the other person's ear on a phone call, so leave it false.\n\n## promptStyle: Apple's signal for when to shut up\n\nApple publishes a hint written for navigation and exercise prompts. [`promptStyle`](https://developer.apple.com/documentation/avfaudio/avaudiosession/promptstyle-swift.property) is \"A hint to audio sessions that use voice prompt mode to alter the type of prompts they issue in response to other system audio, such as Siri and phone calls.\" Apple: \"Apps that issue voice prompts should observe changes in the prompt style and modify their prompts in response. This property is key-value observable.\" It applies to sessions in the `voicePrompt` mode.\n\n| `AVAudioSession.PromptStyle` | Apple's description | What a workout cue does (our mapping) |\n| --- | --- | --- |\n| `.none` | \"Your app shouldn't issue prompts at this time.\" Apple's example: \"if Siri is recognizing speech, playing navigation or exercise prompts could interfere with Siri's ability to accurately recognize the user's speech.\" | No speech, no tone; haptic only |\n| `.short` | \"Your app should issue short, nonverbal prompts.\" The style is short \"when Siri is active but not recording, when a voicemail is playing back, or when a voice call is active.\" | A tone instead of words |\n| `.normal` | \"Your app may use long, verbal prompts.\" | Full spoken cue |\n\n\"Exercise prompts\" is Apple's phrase, not ours. Read the style at the moment of the cue, not when the workout starts, and route the cue to speech, tone or [haptic](/accessibility/haptics-when-audio-is-busy) accordingly.\n\n## Monday morning\n\nMake the synthesizer a long-lived property and create a fresh utterance per cue. Put `stopSpeaking(at:)` in front of every time-critical cue. Decide `usesApplicationAudioSession` explicitly. Close the ducking window in `didFinish`. Then observe `promptStyle` and test it the documented way: start a workout, invoke Siri mid-interval, and confirm the cue becomes a haptic.",
    "faqs": [
      {
        "q": "Why does my AVSpeechSynthesizer cue never play, or stop after the first word?",
        "a": "The usual cause is that nothing is holding on to the synthesizer. Apple's AVSpeechSynthesizer documentation notes that the system doesn't automatically retain it, so you need to retain it manually until speech concludes. A synthesizer created as a local variable inside a cue function is the classic case. Keep one synthesizer as a property for the lifetime of the workout, and create a new utterance for every cue, since Apple warns that enqueuing the same utterance more than once throws an exception."
      },
      {
        "q": "Should usesApplicationAudioSession be true or false for workout cues?",
        "a": "It depends on whether speech is your only audio. Apple documents that when the property is false the system creates a separate audio session to automatically manage speech, interruptions, and mixing and ducking the speech with other audio sources. That suits an app whose only sound is spoken cues. An app that also plays tones, recorded clips or a music bed is better served by one session it configures itself, with duckOthers and a short activation window around each cue. Apple's page does not state the default, so set the property explicitly either way."
      },
      {
        "q": "How do I stop a late spoken cue from playing after its moment has passed?",
        "a": "Cancel it before speaking the new one. AVSpeechSynthesizer queues utterances and speaks them in the order received, so a long cue still playing will delay the next one. Apple documents stopSpeaking(at:) as immediately cancelling speech and removing all unspoken utterances from the queue, with AVSpeechBoundary choosing between stopping immediately or after the current word. Our choice is the word boundary for a cue that is merely superseded and the immediate boundary when the user pauses the workout."
      },
      {
        "q": "What should a workout app do when AVAudioSession promptStyle is none?",
        "a": "Not prompt at all, by voice or by tone. Apple documents the none style as meaning your app shouldn't issue prompts at this time, because another audio session is using microphone input, and gives the example that playing navigation or exercise prompts while Siri is recognizing speech could interfere with recognition. The short style asks for short, nonverbal prompts, for instance during a voice call, and normal allows long verbal prompts. A haptic is a reasonable stand-in while the style is none."
      }
    ],
    "related": [
      {
        "href": "/audio-coaching/avaudiosession-duckothers-workout-cues",
        "label": "duckOthers and the activation window"
      },
      {
        "href": "/audio-coaching/texttospeech-workout-cues-android",
        "label": "The Android side: TextToSpeech"
      },
      {
        "href": "/accessibility/voiceover-live-workout-metrics",
        "label": "VoiceOver and live workout metrics"
      },
      {
        "href": "/accessibility/haptics-when-audio-is-busy",
        "label": "Haptics when the audio channel is busy"
      },
      {
        "href": "/build/ai-fitness-coaching-app",
        "label": "How to build an AI fitness coaching app"
      }
    ],
    "cta": {
      "pitch": "Speech APIs gain voices, SSML support and session behaviours every release. Our newsletter tracks the changes that affect a coaching voice."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer",
        "checked": "2026-10-03",
        "note": "queue semantics; manual retention"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/speak(_:)",
        "checked": "2026-10-03",
        "note": "same utterance twice throws"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/stopspeaking(at:)",
        "checked": "2026-10-03",
        "note": "cancel and clear the queue"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/usesapplicationaudiosession",
        "checked": "2026-10-03",
        "note": "system-managed separate session"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avspeechutterance",
        "checked": "2026-10-03",
        "note": "rate, volume, delays, voice, SSML, assistive settings"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/promptstyle-swift.property",
        "checked": "2026-10-03",
        "note": "promptStyle and its none, short and normal cases"
      }
    ]
  },
  {
    "slug": "audio-interruptions-during-workout-ios",
    "primaryQuery": "avaudiosession interruption workout app",
    "h1": "Audio interruptions during a workout on iOS: calls, Siri and the cue that never comes back",
    "metaTitle": "AVAudioSession Interruptions During a Workout (iOS)",
    "metaDescription": "interruptionNotification, shouldResume, the WasSuspended key and iOS 27's lifecycle notifications, mapped to what a workout's cues and clock should do.",
    "updated": "2026-10-03",
    "answer": "An interruption deactivates your audio session underneath you: Apple documents that when interruptionNotification arrives with the began type, the system interrupted your session and it's no longer active, and that the ended type carries options in which shouldResume is a hint that it's appropriate to resume without waiting for user input. In iOS 27 Apple added lifecycle notifications, didBecomeInactiveNotification and resumptionRecommendationNotification, and recommends them for new code because they don't get out of sync when the system can't deliver an end event; for iOS 26 and earlier you still observe interruptionNotification. For a workout the audio and the clock are separate decisions: suspend speech during the interruption, keep the workout timer running, and never replay a cue whose moment passed during a call.",
    "body": "A workout is long enough that something will interrupt it: a phone call, an alarm, Siri, another app starting its own audio. When that happens your audio session is deactivated underneath you. The bugs come afterwards: cues that never return, a stale cue that fires the moment the call ends, or a workout clock that stopped because it was tied to audio that stopped.\n\nThis page covers the iOS interruption notifications, including the lifecycle notifications Apple added in iOS 27, and how a workout app should treat each case. Headphones being unplugged is a route change, not an interruption, and has [its own page](/audio-coaching/headphones-disconnect-route-change).\n\n## What an interruption is\n\nApple's [Handling audio interruptions](https://developer.apple.com/documentation/avfaudio/handling-audio-interruptions) article opens with the canonical case: \"consider the scenario of receiving a phone call while you're watching a movie in the TV app on your iPhone. In this case, the movie's audio fades out, playback pauses, and the sound of the call's ringtone fades in. If you decline the call, control returns to the TV app, and playback begins again as the movie's audio fades in.\"\n\nThe article notes that `AVPlayer` \"monitors your app's audio session and automatically pauses playback in response to interruption events.\" A workout app speaking through `AVSpeechSynthesizer` or `AVAudioPlayer` does not get that behaviour for its cue schedule. The schedule is yours to pause and resume.\n\n## The legacy notification: interruptionNotification\n\nFor apps deploying to iOS 26 and earlier, Apple's article says to \"observe interruptionNotification directly.\" The [`interruptionNotification`](https://developer.apple.com/documentation/avfaudio/avaudiosession/interruptionnotification) page: \"If the interruption type is AVAudioSession.InterruptionType.began, the system interrupted your app's audio session and it's no longer active. If the interruption type is AVAudioSession.InterruptionType.ended, this dictionary also contains the AVAudioSessionInterruptionOptionKey key.\" Apple adds: \"The system posts this notification on the main thread.\"\n\n```swift\nfunc handleInterruption(_ notification: Notification) {\n    guard let info = notification.userInfo,\n          let raw = info[AVAudioSessionInterruptionTypeKey] as? UInt,\n          let type = AVAudioSession.InterruptionType(rawValue: raw) else { return }\n\n    switch type {\n    case .began:\n        cueScheduler.suspendSpeech()          // the workout clock keeps running\n    case .ended:\n        let opts = (info[AVAudioSessionInterruptionOptionKey] as? UInt)\n            .map(AVAudioSession.InterruptionOptions.init(rawValue:)) ?? []\n        if opts.contains(.shouldResume) { cueScheduler.resumeSpeech() }\n    @unknown default:\n        break\n    }\n}\n```\n\nThe ended case carries [`shouldResume`](https://developer.apple.com/documentation/avfaudio/avaudiosession/interruptionoptions/shouldresume), which Apple describes as \"a hint that it's appropriate for your app to resume audio playback without waiting for user input.\" Apple adds that apps \"that don't require user input to begin audio playback (such as games) can ignore this flag and resume playback when an interruption ends.\"\n\nApple's [Playing audio guidelines](https://developer.apple.com/design/human-interface-guidelines/playing-audio) give the distinction behind the flag: \"An interruption can be resumable, like an incoming phone call, or nonresumable, like when people start a new music playlist.\"\n\n## The interruption that arrives late\n\nOne note on Apple's notification page explains a confusing report: an interruption notification arriving when the app comes back, long after anything happened. \"Starting in iOS 10, the system deactivates an app's audio session when it suspends the app process. When the app starts running again, it receives an interruption notification that the system has deactivated its audio session. This notification is necessarily delayed in time because the system can only deliver it once the app is running again.\"\n\nIn that case the dictionary \"contains the AVAudioSessionInterruptionWasSuspendedKey key with a value of true.\" Apple's advice is aimed at nonmixable sessions: \"If you configured your audio session to be nonmixable (the default behavior for the playback, playAndRecord, soloAmbient, and multiRoute categories), deactivate your audio session if you're not actively using audio when you go into the background.\"\n\nFor a workout app this key is diagnostic. If you see it during a session the user thinks is live, the process was suspended mid-workout. That is a [background audio](/audio-coaching/background-audio-workout-app-ios) problem, not an interruption-handling one.\n\n## iOS 27: lifecycle notifications\n\nApple's article now leads with a different model: \"In iOS 27, tvOS 27, visionOS 27, and watchOS 27 and later, AVAudioSession posts a set of life-cycle notifications that model interruptions as deactivation and resumption events rather than as begin and end signals. Adopt these notifications for new code because they represent the interrupted-versus-active state directly and don't get out of sync when the system can't deliver an end event.\"\n\n| Notification (iOS 27.0) | Apple's description | User info |\n| --- | --- | --- |\n| [`didBecomeActiveNotification`](https://developer.apple.com/documentation/avfaudio/avaudiosession/didbecomeactivenotification) | Sent when the session becomes active | none |\n| [`didBecomeInactiveNotification`](https://developer.apple.com/documentation/avfaudio/avaudiosession/didbecomeinactivenotification) | Sent when the session becomes inactive | `AVAudioSession.DeactivationContext` under `deactivationContextKey` |\n| [`resumptionRecommendationNotification`](https://developer.apple.com/documentation/avfaudio/avaudiosession/resumptionrecommendationnotification) | Sent when the system suggests whether to resume after an interruption ends | `AVAudioSession.ResumptionContext` under `resumptionContextKey` |\n\nThe deactivation context's `source` says \"whether your app or the system initiated the deactivation,\" and when the system did, `interruptionContext` describes it. That matters for a cue app more than most: you deactivate your own session after every cue to give the user's music back, so you will receive `didBecomeInactiveNotification` constantly for your own deactivations. Filter on the source, or your cue scheduler will treat every finished cue as an interruption.\n\nThe resumption context's `recommendation` is `.shouldResume` or `.shouldNotResume`. Apple: \"Unlike the legacy interruption notification, resumptionRecommendationNotification isn't tied to the interrupting app's end-of-interruption signal, so your app doesn't stay stuck in an interrupted state if that signal never arrives.\" Apple also writes that \"In later releases, the system deprecates\" the legacy notification, its keys and enumerations. Our reading: if you support iOS 26 and earlier, observe both and route them to the same handler.\n\n## Calls: banner or full screen\n\nApple documents a preference that changes whether a call interrupts you at all. [`setPrefersNoInterruptionsFromSystemAlerts(_:)`](https://developer.apple.com/documentation/avfaudio/avaudiosession/setprefersnointerruptionsfromsystemalerts(_:)): \"Beginning in iOS 14, users can set a global preference that indicates whether the system displays incoming calls using a banner or a full-screen display style. If using the banner style, setting this value to true prevents the system from interrupting the audio session with incoming call notifications, and gives the user an opportunity to accept or decline the call. The system only interrupts the audio session if the user accepts the call.\"\n\nMarked important: \"This preference has no effect if the device uses the full-screen display style—the system interrupts the audio session on incoming calls.\" Apple's examples of where it helps are apps \"that record audiovisual media or that you use for music performance.\" Our judgement: for a workout app that only speaks short cues, it is a small gain. Whichever way you set it, test both call display styles, because they behave differently by design.\n\n## When the whole media server restarts\n\nRare, but documented. [`mediaServicesWereResetNotification`](https://developer.apple.com/documentation/avfaudio/avaudiosession/mediaserviceswereresetnotification): \"Under rare circumstances, the system terminates and restarts its media services daemon. Respond to these events by reinitializing your app's audio objects (such as players, recorders, converters, or audio queues) and resetting your audio session's category, options, and mode configuration. Your app shouldn't restart its media playback, recording, or processing until initiated by user action.\" Apple notes you \"don't need to reregister for any audio session notifications.\"\n\nThat last sentence is about media playback. A workout's cue schedule is closer to a timer than to playback; our judgement is to rebuild the audio objects silently and let the next scheduled cue play. Apple gives a way to test it, covered on [the testing page](/audio-coaching/testing-workout-audio-cues).\n\n## What a workout should do with each case\n\nThe right column is our judgement. The middle column is what Apple documents.\n\n| Event | What Apple documents | What the workout should do |\n| --- | --- | --- |\n| Incoming call, accepted | Session interrupted, no longer active | Keep the workout clock running; suspend speech; show the cue visually |\n| Call ends with `shouldResume` | A hint it is appropriate to resume without user input | Resume the schedule from the current time; do not replay the cue that was cut off |\n| Call ends without `shouldResume` | Do not resume automatically | Stay silent until the next user action or the next cue boundary |\n| Another app starts its own playlist | Nonresumable interruption | Treat cues as off until the user returns to the app |\n| `WasSuspended` key is true | Session was deactivated when the process was suspended | Treat it as a background-execution bug and investigate |\n| Media services reset | Rebuild audio objects, reset category, options and mode | Rebuild silently; carry on at the next cue |\n\nThe commonest mistake in that table is the second row: replaying the cue that was interrupted. \"Ten seconds left\" replayed after a two-minute call is wrong. Cues are tied to workout time, not to a playlist position.\n\n## Monday morning\n\nFind your interruption handler, or confirm you do not have one. Make sure it suspends speech without stopping the workout clock, that a resumed schedule recomputes the next cue from elapsed time, and that no stale cue replays. If you target iOS 27, observe the lifecycle notifications and filter out your own deactivations by source. Then take a real call mid-interval, once with each call display style.",
    "faqs": [
      {
        "q": "Why does my app never get an interruption ended notification after a call?",
        "a": "Because the end signal is not guaranteed. Apple's Handling audio interruptions article says the iOS 27 lifecycle notifications exist precisely because they don't get out of sync when the system can't deliver an end event, and that resumptionRecommendationNotification isn't tied to the interrupting app's end-of-interruption signal, so your app doesn't stay stuck in an interrupted state if that signal never arrives. On iOS 26 and earlier, design the cue scheduler so the next scheduled cue, or the next user action, recovers the session even if no ended notification ever comes."
      },
      {
        "q": "Should a workout app automatically resume voice cues after a phone call ends?",
        "a": "Resume the schedule, not the interrupted cue. Apple documents shouldResume as a hint that it's appropriate to resume audio playback without waiting for user input, and its design guidance distinguishes resumable interruptions, like a phone call, from nonresumable ones, like the user starting a new playlist. Our judgement for a workout is to resume speaking at the next cue boundary computed from elapsed workout time, and to drop any cue whose moment passed during the call. A ten-seconds-left cue replayed after a two-minute call is simply wrong."
      },
      {
        "q": "What does AVAudioSessionInterruptionWasSuspendedKey mean in a workout app?",
        "a": "That your process was suspended and the session was deactivated while it was asleep. Apple documents that starting in iOS 10 the system deactivates an app's audio session when it suspends the app, and delivers an interruption notification, necessarily delayed, once the app runs again, with this key set to true. If you see it during a workout the user believes is live, the problem is background execution rather than interruption handling, and the background audio configuration is the first thing to check."
      },
      {
        "q": "Can I stop incoming calls from interrupting my app's workout audio?",
        "a": "Partly, and only for one call style. Apple documents setPrefersNoInterruptionsFromSystemAlerts: if the user has chosen the banner style for incoming calls, setting it to true prevents the system interrupting your session for the call notification, and the session is interrupted only if the user accepts the call. Apple marks it important that the preference has no effect with the full-screen style, where the system interrupts the session on incoming calls. Test both styles, because they behave differently by design."
      }
    ],
    "related": [
      {
        "href": "/audio-coaching/headphones-disconnect-route-change",
        "label": "Headphones disconnecting mid-workout"
      },
      {
        "href": "/audio-coaching/background-audio-workout-app-ios",
        "label": "Background audio for workout apps"
      },
      {
        "href": "/audio-coaching/testing-workout-audio-cues",
        "label": "Testing audio cues on devices"
      },
      {
        "href": "/build/meditation-app",
        "label": "How to build a meditation app"
      },
      {
        "href": "/engagement/live-activities-workout-tracking",
        "label": "Live Activities for workout tracking"
      }
    ],
    "cta": {
      "pitch": "iOS 27 changed how audio interruptions are delivered, and the legacy notification is on its way out. Our newsletter tracks platform changes like this one for fitness apps."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/documentation/avfaudio/handling-audio-interruptions",
        "checked": "2026-10-03",
        "note": "interruption model, iOS 27 lifecycle notifications, legacy handling"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/interruptionnotification",
        "checked": "2026-10-03",
        "note": "began and ended; main thread; WasSuspended key"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/interruptionoptions/shouldresume",
        "checked": "2026-10-03",
        "note": "resume hint"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/setprefersnointerruptionsfromsystemalerts(_:)",
        "checked": "2026-10-03",
        "note": "banner versus full-screen calls"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/mediaserviceswereresetnotification",
        "checked": "2026-10-03",
        "note": "media server reset handling"
      }
    ]
  },
  {
    "slug": "background-audio-workout-app-ios",
    "primaryQuery": "uibackgroundmodes audio workout app",
    "h1": "Background audio for an iPhone workout app: UIBackgroundModes audio, and what it does not promise",
    "metaTitle": "UIBackgroundModes audio: Workout Cues With Screen Locked",
    "metaDescription": "Two switches keep iPhone workout cues playing after the lock: the playback category and the audio background mode. What Apple says, and what it doesn't.",
    "updated": "2026-10-03",
    "answer": "An iPhone workout app needs two things for cues to keep playing after the screen locks: an audio session category that continues when the screen locks, such as playback, and the audio value in the UIBackgroundModes array, which Xcode adds when you tick Audio, AirPlay, and Picture in Picture under the Background Modes capability. Apple asks you to use background execution modes sparingly, and App Store Review Guideline 2.5.4 says multitasking apps may only use background services for their intended purposes, audio playback among them. Apple's pages do not state whether an app keeps executing during silent gaps between cues, so verify your cue timing on a locked device. On Apple Watch, background cues are valid only while a workout session is running.",
    "body": "A cue that plays in the simulator and dies on the first locked-phone run has usually failed one of two separate switches. One is the audio session category, which decides whether audio continues when the screen locks. The other is a background execution mode, which decides whether the app is allowed to keep playing once it is in the background. Apple documents both, and a workout app needs both.\n\nThis page covers the iPhone side, says plainly what Apple's pages do not promise, and points to the different rules on Apple Watch.\n\n## Switch one: a category that survives the lock\n\nApple's [`playback`](https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playback) category page says audio \"continues with the Silent switch set to silent or when the screen locks,\" then names the second switch in the same breath: \"To continue playing audio when your app transitions to the background (for example, when the screen locks), add the `audio` value to the UIBackgroundModes key in your information property list file.\"\n\nThe default category and `ambient` are both, in Apple's words, silenced by screen locking, so no background mode rescues them. Picking the category is [its own page](/audio-coaching/avaudiosession-category-workout-app).\n\n## Switch two: UIBackgroundModes audio\n\nApple's [`UIBackgroundModes`](https://developer.apple.com/documentation/bundleresources/information-property-list/uibackgroundmodes) key covers \"Services provided by an app that require it to run in the background,\" and Apple says to add it by enabling \"the Background Modes capability in Xcode.\"\n\nApple's [Configuring background execution modes](https://developer.apple.com/documentation/xcode/configuring-background-execution-modes) article gives the steps: select the target, open Signing & Capabilities, find Background Modes, and tick the modes you need, after which \"Xcode adds the UIBackgroundModes array to your app's `Info.plist` file, if it isn't already present.\" In its table the iPhone mode is called \"Audio, AirPlay, and Picture in Picture,\" value `audio`, described as \"The app plays audible content in the background.\" The result in `Info.plist`:\n\n```xml\n<key>UIBackgroundModes</key>\n<array>\n  <string>audio</string>\n</array>\n```\n\nApple's [Configuring your app for media playback](https://developer.apple.com/documentation/avfoundation/configuring-your-app-for-media-playback) article joins the two switches: \"With this mode enabled and your audio session configured, your app is ready to play background audio.\"\n\n## Use it sparingly, and for what it is for\n\nApple's background-modes article is direct about cost: \"Use background execution modes sparingly because overuse can negatively impact device performance and battery life. If an alternative to executing in the background exists, use the alternative instead.\"\n\nThe App Store Review Guidelines, last updated June 8, 2026 when we read them, say in guideline 2.5.4: \"Multitasking apps may only use background services for their intended purposes: VoIP, audio playback, location, task completion, local notifications, etc.\" Store policy as a whole belongs to [compliance](/compliance); we quote the guideline only because it bears on this choice, and we make no prediction about any review outcome.\n\nOur reading, as engineering guidance: a workout app that speaks coaching cues during a session is playing audio, which is what the mode is for. A run-tracking app that holds the `location` mode for GPS is using that mode for location. Declare each mode for the job it does, not one to cover the other.\n\n## What these pages do not promise\n\nHere precision matters more than reassurance. Apple's background-modes article says that for apps adopting these modes, \"the system launches or resumes the app, in the background, and affords it time to process any related events.\" None of the pages we read for this cluster says whether an app with the audio mode keeps executing during the silent minutes between cues, when no audio is playing.\n\nThere is a hint in the other direction. Apple's [`interruptionNotification`](https://developer.apple.com/documentation/avfaudio/avaudiosession/interruptionnotification) page notes: \"Starting in iOS 10, the system deactivates an app's audio session when it suspends the app process,\" so a suspended process is a documented state for an audio app. We are not going to claim the mode keeps your timer alive, or that it does not. If your cue schedule depends on your code running at a precise moment with the screen locked, prove that on a device, with the screen off, for a full workout. Our [HIIT app guide](/build/hiit-app) treats this as a scheduling problem and explains why.\n\n## Apple Watch is a different rulebook\n\nApple's [Running workout sessions](https://developer.apple.com/documentation/healthkit/running-workout-sessions) article: \"Workout sessions require the Workout processing background mode. If your app plays audio or provides haptic feedback during the workout session, you must also add the Audio background mode.\" And: \"Workout apps can use the AVFoundation framework to play short audio clips in the background, such as coaching or notifications. In order to play an audio clip, an active workout session must be running; any attempt to play background audio outside a workout session are invalid.\"\n\nSo on the watch the session, not the background mode alone, is what makes background cues valid. The session lifecycle is covered in [HKWorkoutSession lifecycle](/watch-apps/hkworkoutsession-lifecycle-swift), and audio output on the wrist, speaker or Bluetooth, is on [the watch audio page](/audio-coaching/wear-os-watchos-workout-audio).\n\n## A checklist that catches both switches\n\n| Check | Where | Symptom if wrong |\n| --- | --- | --- |\n| Category is `playback`, with a mixing option | `setCategory` at workout start | Cues silent when locked, or the user's music stops |\n| `audio` is in `UIBackgroundModes` | Signing & Capabilities, then Info.plist | Cues stop when the app goes to the background |\n| Session activated only around cues | Cue player | The user's music stays ducked for the whole workout |\n| On watchOS, a workout session is running | `HKWorkoutSession` | Background clips are invalid outside a session |\n\n## Monday morning\n\nOpen Signing & Capabilities and confirm Background Modes is there with Audio ticked; open Info.plist and confirm `audio` is in the array. Confirm the category is set before the first cue. Then run a full workout on a device with the screen locked from the first minute, and log the wall-clock time each cue actually played against the time it was scheduled.",
    "faqs": [
      {
        "q": "Do I need UIBackgroundModes audio for workout cues on iPhone?",
        "a": "Yes, if cues must play after the app leaves the foreground. Apple's playback category page says that to continue playing audio when your app transitions to the background, for example when the screen locks, you add the audio value to the UIBackgroundModes key in your Info.plist. Apple's Configuring background execution modes article shows the Xcode route: add the Background Modes capability and tick Audio, AirPlay, and Picture in Picture. The category and the background mode are separate switches, and a workout app needs both."
      },
      {
        "q": "Will App Review accept background audio in a workout app?",
        "a": "We cannot predict any review outcome, and this is not legal or store-policy advice. What we can quote is App Store Review Guideline 2.5.4, from the guidelines last updated June 8, 2026: multitasking apps may only use background services for their intended purposes, with VoIP, audio playback, location, task completion and local notifications listed. Our engineering reading is that speaking coaching cues during a workout is audio playback, and that each background mode should be declared for the job it actually does."
      },
      {
        "q": "Why does my workout cue play in testing but not when the iPhone is locked?",
        "a": "Usually one of two switches is missing. The default and ambient categories are, per Apple, silenced by screen locking, so the session needs a category such as playback; and to continue in the background Apple says the audio value must be in UIBackgroundModes. If both are present and cues still drift or vanish, check whether your scheduling code depends on running during silent gaps between cues, which none of Apple's pages we read promises, and test the full workout with the screen locked from the start."
      }
    ],
    "related": [
      {
        "href": "/audio-coaching/avaudiosession-category-workout-app",
        "label": "Choosing the AVAudioSession category"
      },
      {
        "href": "/watch-apps/hkworkoutsession-lifecycle-swift",
        "label": "HKWorkoutSession lifecycle on Apple Watch"
      },
      {
        "href": "/watch-apps/apple-watch-background-execution",
        "label": "Background execution on Apple Watch"
      },
      {
        "href": "/build/hiit-app",
        "label": "How to build a HIIT app"
      },
      {
        "href": "/compliance",
        "label": "Compliance and store policy"
      }
    ],
    "cta": {
      "pitch": "Background execution rules and review guidelines both move. Our newsletter flags the changes that decide whether a locked-screen workout keeps talking."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playback",
        "checked": "2026-10-03",
        "note": "lock, Silent switch, UIBackgroundModes audio"
      },
      {
        "url": "https://developer.apple.com/documentation/xcode/configuring-background-execution-modes",
        "checked": "2026-10-03",
        "note": "modes table, sparing use, Xcode steps"
      },
      {
        "url": "https://developer.apple.com/documentation/bundleresources/information-property-list/uibackgroundmodes",
        "checked": "2026-10-03",
        "note": "the key and capability"
      },
      {
        "url": "https://developer.apple.com/documentation/avfoundation/configuring-your-app-for-media-playback",
        "checked": "2026-10-03",
        "note": "category plus background mode"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/running-workout-sessions",
        "checked": "2026-10-03",
        "note": "watchOS workout processing and audio mode; clips only during a session"
      },
      {
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "checked": "2026-10-03",
        "note": "guideline 2.5.4, last updated June 8, 2026"
      }
    ]
  },
  {
    "slug": "headphones-disconnect-route-change",
    "primaryQuery": "headphones disconnected during workout audio",
    "h1": "Headphones out mid-run: route changes on iOS and AUDIO_BECOMING_NOISY on Android",
    "metaTitle": "Headphones Disconnect Mid-Workout: Route Change Handling",
    "metaDescription": "oldDeviceUnavailable on iOS and ACTION_AUDIO_BECOMING_NOISY on Android: stop speaking out loud when earbuds drop, but keep the workout clock running.",
    "updated": "2026-10-03",
    "answer": "When headphones disconnect, both platforms tell you and both expect you not to carry on through the speaker. Apple's route-change guide says users who disconnect headphones don't want to automatically share what they're listening to, and that apps should automatically pause playback; the signal is routeChangeNotification with the reason oldDeviceUnavailable, posted on a secondary thread. Google documents ACTION_AUDIO_BECOMING_NOISY as a hint sent when a wired headset is unplugged or an A2DP sink disconnects and audio is about to switch to the speaker, and says to register a receiver while you are playing. A workout app makes two decisions here: stop its spoken cues, and usually keep the workout itself running.",
    "body": "Earbuds fall out on runs. A Bluetooth headset drops when the phone is on the far side of the body. A wired pair gets yanked by a cable machine. Each time, the operating system moves audio to the phone's speaker, and the next coaching cue, \"you're slowing down, pick it up\", plays out loud on a train platform.\n\nBoth platforms tell you when this happens and both expect you not to carry on out loud. A workout app has a second question a music player does not: the audio should stop, but should the workout?\n\n## iOS: routeChangeNotification and oldDeviceUnavailable\n\nApple's [Responding to audio route changes](https://developer.apple.com/documentation/avfaudio/responding-to-audio-route-changes) article defines the event: \"A route change occurs when the system adds or removes an audio input or output. Route changes occur for several reasons, including a user plugging in a pair of headphones, connecting a Bluetooth LE headset, or unplugging a USB audio interface.\"\n\nIt also states the expectation in plain terms: \"When users connect a pair of wired or wireless headphones, they're implicitly indicating that audio playback should continue, but privately. They expect an app that's currently playing media to continue playing without pause. However, when users disconnect their headphones, they don't want to automatically share what they're listening to with others. Applications should respect this implicit privacy request and automatically pause playback when users disconnect their headphones.\"\n\nThe notification is [`routeChangeNotification`](https://developer.apple.com/documentation/avfaudio/avaudiosession/routechangenotification). Its user info \"contains the AVAudioSessionRouteChangeReasonKey and AVAudioSessionRouteChangePreviousRouteKey keys.\" The reason you care about is [`oldDeviceUnavailable`](https://developer.apple.com/documentation/avfaudio/avaudiosession/routechangereason/olddeviceunavailable), \"A value that indicates that the previous audio output path is no longer available.\" Its opposite, `newDeviceAvailable`, means \"a user action, such as plugging in a headset, has made a preferred audio route available.\"\n\nOne line on the notification page decides how you write the handler: \"The system posts this notification on a secondary thread.\" The interruption notification is posted on the main thread; this one is not. Hop to the main actor before touching the cue scheduler or the UI.\n\n```swift\nlet privatePorts: Set<AVAudioSession.Port> = [.headphones, .bluetoothA2DP, .bluetoothLE]\n\nfunc handleRouteChange(_ notification: Notification) {\n    guard let info = notification.userInfo,\n          let raw = info[AVAudioSessionRouteChangeReasonKey] as? UInt,\n          let reason = AVAudioSession.RouteChangeReason(rawValue: raw),\n          reason == .oldDeviceUnavailable,\n          let previous = info[AVAudioSessionRouteChangePreviousRouteKey]\n              as? AVAudioSessionRouteDescription,\n          previous.outputs.contains(where: { privatePorts.contains($0.portType) })\n    else { return }\n\n    Task { @MainActor in cueScheduler.headphonesRemoved() }\n}\n```\n\nApple's article checks only `.headphones`, which its `AVAudioSession.Port` reference describes as \"An output to wired headphones.\" Wireless earbuds report other ports: `.bluetoothA2DP` is \"An output to a Bluetooth A2DP device\" and `.bluetoothLE` \"An output to a Bluetooth Low Energy (LE) device.\" Copy Apple's check unchanged and your handler ignores every wireless headset.\n\nApple also documents [`prefersInterruptionOnRouteDisconnect`](https://developer.apple.com/documentation/avfaudio/avaudiosession/prefersinterruptiononroutedisconnect), available from iOS 17: \"A Boolean value that indicates whether the system interrupts the audio session when the active route disconnects.\" Apple states \"The default value is true.\" So on current systems a disconnect can reach you as an interruption as well as a route change; a handler written for only one of the two will miss cases. The interruption side is on [the interruptions page](/audio-coaching/audio-interruptions-during-workout-ios).\n\nApple's [Playing audio guidelines](https://developer.apple.com/design/human-interface-guidelines/playing-audio) put the expectation in one sentence: \"when disconnecting headphones, they expect playback to pause immediately.\"\n\n## Android: ACTION_AUDIO_BECOMING_NOISY\n\nGoogle's [AudioManager reference](https://developer.android.com/reference/android/media/AudioManager) documents `ACTION_AUDIO_BECOMING_NOISY` as a \"Broadcast intent, a hint for applications that audio is about to become 'noisy' due to a change in audio outputs. For example, this intent may be sent when a wired headset is unplugged, or when an A2DP audio sink is disconnected, and the audio system is about to automatically switch audio route to the speaker.\" Google continues: \"Applications that are controlling audio streams may consider pausing, reducing volume or some other action on receipt of this intent so as not to surprise the user with audio from the speaker.\" The constant value is `android.media.AUDIO_BECOMING_NOISY`.\n\nGoogle's [Handling changes in audio output](https://developer.android.com/media/platform/output) guide says to \"create a BroadcastReceiver that listens for this intent whenever you're playing audio,\" and to \"Register the receiver when you begin playback, and unregister it when you stop.\"\n\n```kotlin\nprivate class BecomingNoisyReceiver : BroadcastReceiver() {\n    override fun onReceive(context: Context, intent: Intent) {\n        if (intent.action == AudioManager.ACTION_AUDIO_BECOMING_NOISY) {\n            cueScheduler.headphonesRemoved()\n        }\n    }\n}\n\nprivate val noisyFilter = IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY)\n```\n\nThe same guide draws a line that a workout app falls across: \"Users usually expect apps that include a music player with onscreen playback controls to pause playback in this case. Other apps, like games that don't include controls, should keep playing.\" A coaching app has controls, but the thing playing is a schedule, not a track.\n\nOn a watch, the Wear OS guide handles the Bluetooth case with `registerAudioDeviceCallback` rather than this broadcast; that is on [the watch audio page](/audio-coaching/wear-os-watchos-workout-audio).\n\n## Two decisions, not one\n\nWhat follows is our judgement, built on the platform behaviour above.\n\n**The audio decision** follows the platforms: stop speaking out loud. Neither company's guidance supports carrying on through the speaker after headphones are pulled, and Apple frames it as a privacy expectation.\n\n**The workout decision** is yours, and it is usually the opposite. The person lost an earbud; they did not stop running. Pausing the workout clock because the audio route changed corrupts the session record: a run with a three-minute hole that never happened.\n\n| What changed | Audio | Workout clock | Tell the user by |\n| --- | --- | --- | --- |\n| Headphones removed mid-interval | Stop spoken cues | Keep running | A [haptic](/accessibility/haptics-when-audio-is-busy) and the on-screen state |\n| Headphones reconnected | Resume cues at the next boundary | Unchanged | The next cue |\n| Bluetooth drops and reconnects within seconds | Skip cues during the gap; do not replay them | Unchanged | Nothing, if no cue fell in the gap |\n| The user taps pause | Stop | Pause | The pause UI |\n\nThe third row is where most implementations go wrong: they queue the cues that fell in the gap and play them all on reconnect. A burst of three stale cues is worse than missing one.\n\n## Speaker as a deliberate choice\n\nSome users train without headphones on purpose: a phone on the floor beside a mat, a tablet propped against a wall at home. For them, speaker output is the intended route. Our judgement: make speaker cues an explicit setting, ask once when a workout starts with no headphones connected, and only then treat a disconnect as not worth pausing for. The platforms' default expectation is privacy; an opt-in is how a user overrides it.\n\n## Monday morning\n\nRegister the route-change observer on iOS and the becoming-noisy receiver on Android for the lifetime of the workout. In both handlers, stop spoken cues, keep the workout clock running, and fire a haptic. Make sure no cue that fell inside a disconnect gap is replayed later. Then pull an earbud mid-interval on each platform, once wired and once Bluetooth.",
    "faqs": [
      {
        "q": "Should a workout app keep speaking cues through the phone speaker after headphones disconnect?",
        "a": "Not unless the user opted in. Apple's route-change guide frames a headphone disconnect as an implicit privacy request and says apps should automatically pause playback, and Google's guide warns that audio rerouted to the speaker can be a noisy surprise. Our judgement is to stop spoken cues, fire a haptic, and keep the workout clock running, because the person lost an earbud, not their workout. Users who train without headphones on purpose can turn on speaker cues as an explicit setting."
      },
      {
        "q": "Which thread does AVAudioSession routeChangeNotification arrive on?",
        "a": "A secondary thread. Apple's routeChangeNotification page states that the system posts this notification on a secondary thread, unlike the interruption notification, which Apple documents as posted on the main thread. Hop to the main actor before touching your cue scheduler or the interface. The notification's user info carries AVAudioSessionRouteChangeReasonKey and AVAudioSessionRouteChangePreviousRouteKey, and the previous route is where you check which outputs were just lost."
      },
      {
        "q": "What is ACTION_AUDIO_BECOMING_NOISY and when is it sent?",
        "a": "A broadcast intent Android sends just before audio moves to the speaker. Google's AudioManager reference describes it as a hint that audio is about to become noisy due to a change in audio outputs, for example when a wired headset is unplugged or an A2DP audio sink is disconnected, and suggests pausing, reducing volume or some other action so as not to surprise the user. Google's output guide says to register a BroadcastReceiver for it when playback begins and unregister it when playback stops."
      }
    ],
    "related": [
      {
        "href": "/audio-coaching/audio-interruptions-during-workout-ios",
        "label": "Audio interruptions on iOS"
      },
      {
        "href": "/audio-coaching/wear-os-watchos-workout-audio",
        "label": "Watch audio: speaker or Bluetooth"
      },
      {
        "href": "/accessibility/haptics-when-audio-is-busy",
        "label": "Haptics when the audio channel is busy"
      },
      {
        "href": "/build/running-app",
        "label": "How to build a running app"
      },
      {
        "href": "/audio-coaching/testing-workout-audio-cues",
        "label": "Testing audio cues on devices"
      }
    ],
    "cta": {
      "pitch": "Route handling is where audio code quietly regresses between OS releases. Our newsletter tracks the platform changes that affect it."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/documentation/avfaudio/responding-to-audio-route-changes",
        "checked": "2026-10-03",
        "note": "route change model; pause on disconnect"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/routechangenotification",
        "checked": "2026-10-03",
        "note": "user info keys; secondary thread"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/prefersinterruptiononroutedisconnect",
        "checked": "2026-10-03",
        "note": "iOS 17 preference, default true"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/port",
        "checked": "2026-10-03",
        "note": "headphones, bluetoothA2DP and bluetoothLE port types"
      },
      {
        "url": "https://developer.android.com/reference/android/media/AudioManager",
        "checked": "2026-10-03",
        "note": "ACTION_AUDIO_BECOMING_NOISY"
      },
      {
        "url": "https://developer.android.com/media/platform/output",
        "checked": "2026-10-03",
        "note": "registering the becoming-noisy receiver"
      }
    ]
  },
  {
    "slug": "android-audio-focus-may-duck",
    "primaryQuery": "audiofocus_gain_transient_may_duck",
    "h1": "Android audio focus for workout cues: AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK",
    "metaTitle": "AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK for Workout Cues",
    "metaDescription": "Request MAY_DUCK focus per cue, play only when granted, abandon the same request. Why podcasts pause instead, and why AUDIOFOCUS_GAIN mutes music.",
    "updated": "2026-10-03",
    "answer": "For each cue, request AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK, play only when the request returns AUDIOFOCUS_REQUEST_GRANTED, and abandon focus with the same AudioFocusRequest instance when the cue finishes. Google documents that focus type as a short, temporary request where it is acceptable for other apps to keep playing at a lowered volume, and since Android 8.0 the system ducks the other app automatically, without calling its listener, unless that app is playing CONTENT_TYPE_SPEECH content or set setWillPauseWhenDucked(true). Speech apps such as podcast players receive AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK instead, so they can pause. Never request AUDIOFOCUS_GAIN for a cue: on Android 12 and higher Google documents that it makes the system fade out a playing media app, which stays muted until it requests focus again.",
    "body": "Android's answer to \"duck the user's music for a cue\" is audio focus, and the constant that does it is `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK`. Since Android 8.0 the system does the ducking for you, which is good news with conditions attached. Request the wrong focus type and the music fades out and stays muted. Forget to abandon focus and it stays ducked. And the user's podcast is deliberately excluded from automatic ducking.\n\nThis page covers the request, the release, and what happens to the app you interrupt. The background restriction added for apps targeting Android 15 is [its own page](/audio-coaching/audiofocus-request-failed-android-15); the iOS counterpart is [duckOthers](/audio-coaching/avaudiosession-duckothers-workout-cues).\n\n## Audio focus in one paragraph\n\nGoogle's [Manage audio focus](https://developer.android.com/media/optimize/audio-focus) guide: \"To avoid every music app playing at the same time, Android introduces the idea of audio focus. Only one app can hold audio focus at a time.\" And: \"When your app needs to output audio, it should request audio focus.\" The [`AudioFocusRequest`](https://developer.android.com/reference/android/media/AudioFocusRequest) reference adds the rule cue code most often skips: \"applications should not play anything until granted focus.\"\n\n## The four focus types, and the one a cue wants\n\nGoogle's `AudioFocusRequest` reference describes all four:\n\n| Focus gain | Google's description, shortened | Fits a workout cue? |\n| --- | --- | --- |\n| `AUDIOFOCUS_GAIN` | \"your application is now the sole source of audio,\" duration unknown, for music, a game or a video player | No: you are not replacing their music |\n| `AUDIOFOCUS_GAIN_TRANSIENT` | Temporarily grabbing focus; the user expects playback \"to go back to where it was,\" for an alarm or a VoIP call | Only for something that genuinely should pause their music |\n| `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK` | Temporary, but \"you allow another application to keep playing at a reduced volume,\" for driving directions or notifications | Yes |\n| `AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE` | Temporary, and \"your application expects the device to not play anything else,\" for recording or speech recognition | No |\n\nThe [`AudioManager`](https://developer.android.com/reference/android/media/AudioManager) reference describes the third as \"a temporary request of audio focus, anticipated to last a short amount of time, and where it is acceptable for other audio applications to keep playing after having lowered their output level (also referred to as \"ducking\").\" Google's examples are driving directions; a coaching cue has the same shape: short, spoken, intermittent, over music.\n\n## Request, play, abandon\n\n```kotlin\nprivate val cueAttributes = AudioAttributes.Builder()\n    .setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE)\n    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)\n    .build()\n\nprivate val cueFocus = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)\n    .setAudioAttributes(cueAttributes)\n    .build()\n\nfun playCue() {\n    if (audioManager.requestAudioFocus(cueFocus) != AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {\n        haptics.cue()          // no focus, no sound\n        return\n    }\n    player.play(cue, cueAttributes) { audioManager.abandonAudioFocusRequest(cueFocus) }\n}\n```\n\nThree documented rules sit in those lines. Google's guide says to \"Use the same AudioFocusRequest instance both when you request and abandon focus.\" It says to use \"the same attributes in the focus request that you use in your audio player,\" and if you set none, \"AudioAttributes defaults to AudioAttributes.USAGE_MEDIA.\" And `abandonAudioFocusRequest` \"Causes the previous focus owner, if any, to receive focus,\" which is what brings the music back up. Which usage to pick is a judgement with real consequences, set out on [the AudioAttributes page](/audio-coaching/audioattributes-usage-coaching-cues).\n\n## Automatic ducking, and its conditions\n\nGoogle's guide: \"Automatic ducking (temporarily reducing the audio level of one app so that another can be heard clearly) was introduced in Android 8.0 (API level 26). By having the system implement ducking, you don't have to implement ducking in your app.\"\n\nIt happens when the app already playing \"successfully requested audio focus with any type of focus gain,\" \"is not playing audio with content type AudioAttributes.CONTENT_TYPE_SPEECH,\" and \"did not set AudioFocusRequest.Builder.setWillPauseWhenDucked(true),\" and a second app \"requests audio focus with AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK.\" Then \"the audio system ducks all the active players of the first app while the second app has focus. When the second app abandons focus, it unducks them. The first app is not notified when it loses focus, so it doesn't have to do anything.\"\n\nHow far it ducks is not stated in that guide. The `AudioFocusRequest` reference gives the figure for apps that duck themselves: \"A typical attenuation by the \"ducked\" application is a factor of 0.2f (or -14dB).\" That is Google's number for self-ducking apps, not a measurement of the system's behaviour, and we have not measured either.\n\n## Why the podcast pauses instead\n\nThe `CONTENT_TYPE_SPEECH` condition is deliberate. Google's guide: \"automatic ducking is not performed when the user is listening to speech content, because the user might miss some of the program.\" The `AudioFocusRequest` reference describes what happens instead: since \"the system will not automatically duck applications that play speech, it calls their focus listener instead to notify them of AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK, so they can pause instead.\"\n\nSo the same cue code produces different results depending on what the user is playing: music ducks, a well-behaved podcast app pauses, then resumes when you abandon focus. This matches what Apple achieves with `interruptSpokenAudioAndMixWithOthers`, reached from the other side. If your own app plays long guided audio, you are the podcast in this story; mark it `CONTENT_TYPE_SPEECH` and handle `AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK` by pausing.\n\n## Never request AUDIOFOCUS_GAIN for a cue\n\nOn Android 12 (API level 31) and higher, Google documents a forced fade-out. It happens when the playing app has `USAGE_MEDIA` or `USAGE_GAME`, \"successfully requested audio focus with AudioManager.AUDIOFOCUS_GAIN,\" and \"is not playing audio with content type AudioAttributes.CONTENT_TYPE_SPEECH,\" and then \"A second app requests audio focus with AudioManager.AUDIOFOCUS_GAIN.\" Then \"the audio system fades out the first app. At the end of the fade out, the system notifies the first app of focus loss. The app's players remain muted until the app requests audio focus again.\"\n\nThat is the bug behind \"my workout app killed my music.\" A cue that requests `AUDIOFOCUS_GAIN` tells the music app it has lost focus for good, and Google's guide says an app getting `AUDIOFOCUS_LOSS` \"should pause playback immediately, as it won't ever receive an AUDIOFOCUS_GAIN callback. To restart playback, the user must take an explicit action.\"\n\n## When the request fails, or is delayed\n\n`requestAudioFocus` returns `AUDIOFOCUS_REQUEST_GRANTED`, `AUDIOFOCUS_REQUEST_FAILED` or `AUDIOFOCUS_REQUEST_DELAYED`. Google's guide: \"Sometimes the system cannot grant a request for audio focus because the focus is \"locked\" by another app, such as during a phone call. In this case, requestAudioFocus() returns AUDIOFOCUS_REQUEST_FAILED. When this happens, your app should not proceed with audio playback because it did not gain focus.\"\n\n`setAcceptsDelayedFocusGain(true)` turns that into `AUDIOFOCUS_REQUEST_DELAYED`, with a callback once the lock clears. Google says delayed gain \"only works if you also specify an AudioManager.OnAudioFocusChangeListener.\" Our judgement: do not accept delayed gain for a time-critical cue. \"Ten seconds left\" delivered after the phone call ends is wrong; skip it, fire the [haptic](/accessibility/haptics-when-audio-is-busy), and let the next cue land on time.\n\n## Older Android, briefly\n\nBefore Android 8.0 there is no `AudioFocusRequest`: you call `requestAudioFocus` with a listener, a stream such as `STREAM_MUSIC`, and a duration hint, and release with `abandonAudioFocus`. Google's guide calls ducking \"particularly suitable for apps that use the audio stream intermittently, such as for audible driving directions.\" On Android 11 and lower the guide warns that focus \"is not managed by the system,\" so an app that keeps playing loudly after losing focus cannot be stopped by the system. In other words, on those versions ducking depends on other apps behaving well.\n\nIf your cues play through ExoPlayer, Google's guide suggests letting it manage focus \"by calling setAudioAttributes with true for the handleAudioFocus parameter.\" Which focus gain ExoPlayer then requests for your attributes is not stated on the pages we read, so check it before relying on it for ducking.\n\n## Monday morning\n\nGrep for `requestAudioFocus`. Every cue path should request `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK` with the same attributes the player uses, play only on `AUDIOFOCUS_REQUEST_GRANTED`, and abandon the same request instance when playback completes. Remove any `AUDIOFOCUS_GAIN` from cue code. Then test against a music app and a podcast app, and on a device running Android 12 or later.",
    "faqs": [
      {
        "q": "Which audio focus type should a workout cue request on Android?",
        "a": "AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK. Google's AudioManager reference describes it as a temporary request of audio focus, anticipated to last a short amount of time, where it is acceptable for other audio applications to keep playing after lowering their output level, and gives driving directions over music as the example. A spoken interval cue has the same shape. AUDIOFOCUS_GAIN is for becoming the sole source of audio, and AUDIOFOCUS_GAIN_TRANSIENT expects the other app to pause, neither of which a short cue needs."
      },
      {
        "q": "Why does the user's podcast pause instead of ducking when my app speaks?",
        "a": "Because Android deliberately does not duck speech. Google's audio focus guide says automatic ducking is not performed when the user is listening to speech content, because the user might miss some of the program. Apps that mark their audio with CONTENT_TYPE_SPEECH are not ducked automatically; instead their focus listener receives AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK so they can pause. When your cue abandons focus, the podcast app gets focus back and can resume. That is the intended behaviour, not a bug in your cue."
      },
      {
        "q": "Does my app have to lower the other app's volume itself on Android?",
        "a": "Not on Android 8.0 and higher. Google documents automatic ducking from Android 8.0: when you request AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK, the system ducks all the active players of the app that held focus and unducks them when you abandon focus, without notifying that app. Two exceptions apply: an app playing CONTENT_TYPE_SPEECH content, and an app that set setWillPauseWhenDucked(true). Before Android 8.0, apps receiving the transient can-duck loss had to lower their own volume."
      },
      {
        "q": "Should a workout cue accept delayed audio focus gain?",
        "a": "Our judgement is no. Google documents setAcceptsDelayedFocusGain(true) as turning a request made while focus is locked, for instance during a phone call, into AUDIOFOCUS_REQUEST_DELAYED, with a callback once the lock clears. That suits music, which can start late. A workout cue is tied to a moment; ten seconds left delivered after a call ends is wrong. When the request fails, skip the spoken cue, fire a haptic, and let the next cue land on time."
      }
    ],
    "related": [
      {
        "href": "/audio-coaching/audiofocus-request-failed-android-15",
        "label": "AUDIOFOCUS_REQUEST_FAILED on Android 15"
      },
      {
        "href": "/audio-coaching/audioattributes-usage-coaching-cues",
        "label": "Which AudioAttributes usage to declare"
      },
      {
        "href": "/audio-coaching/avaudiosession-duckothers-workout-cues",
        "label": "The iOS equivalent: duckOthers"
      },
      {
        "href": "/guides/ai-workout-tracking-android-kotlin",
        "label": "AI workout tracking on Android"
      },
      {
        "href": "/build/hiit-app",
        "label": "How to build a HIIT app"
      }
    ],
    "cta": {
      "pitch": "Android has changed audio focus rules in several releases in a row. Our newsletter tracks the ones that change what a workout cue has to do."
    },
    "steps": [
      {
        "name": "Build the attributes and the request once",
        "text": "Create one AudioAttributes for spoken cues and one AudioFocusRequest built with AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK and those attributes. Google says to use the same attributes in the focus request as in the player."
      },
      {
        "name": "Request focus immediately before the cue",
        "text": "Call requestAudioFocus with the request. Play only on AUDIOFOCUS_REQUEST_GRANTED; Google says applications should not play anything until granted focus."
      },
      {
        "name": "Play the cue",
        "text": "Play the clip or utterance with the same attributes. On Android 8.0 and higher the system ducks the previous focus holder automatically unless it plays speech content or asked to pause when ducked."
      },
      {
        "name": "Abandon the same request when it finishes",
        "text": "Call abandonAudioFocusRequest with the same AudioFocusRequest instance from the completion callback, which returns focus to the previous owner and restores its volume."
      }
    ],
    "sources": [
      {
        "url": "https://developer.android.com/media/optimize/audio-focus",
        "checked": "2026-10-03",
        "note": "focus guidelines, automatic ducking, Android 12 fade-out, delayed gain, older APIs"
      },
      {
        "url": "https://developer.android.com/reference/android/media/AudioFocusRequest",
        "checked": "2026-10-03",
        "note": "focus types, ducking speech, typical attenuation"
      },
      {
        "url": "https://developer.android.com/reference/android/media/AudioManager",
        "checked": "2026-10-03",
        "note": "focus constants, request and abandon"
      }
    ]
  },
  {
    "slug": "audiofocus-request-failed-android-15",
    "primaryQuery": "audiofocus_request_failed android 15",
    "h1": "AUDIOFOCUS_REQUEST_FAILED in the background on Android 15: your cue needs a foreground service",
    "metaTitle": "AUDIOFOCUS_REQUEST_FAILED on Android 15: Background Cues",
    "metaDescription": "Apps targeting Android 15 can't request audio focus unless they are the top app or run a foreground service. Which service type a workout app should use.",
    "updated": "2026-10-03",
    "answer": "If your app targets Android 15 (API level 35) or higher, Google documents that it cannot request audio focus unless it's the top app or running a foreground service, and that the request returns AUDIOFOCUS_REQUEST_FAILED otherwise. A workout app speaking cues with the screen off is not the top app, so unless it started a foreground service its first background cue fails silently. The fix is to run the workout in a foreground service started when the user taps start: Google's foreground service types page lists health for long-running fitness use cases such as exercise trackers, and mediaPlayback for continuing audio or video playback in the background, each with its own manifest permission. A second, unrelated cause of the same return value is focus locked by a phone call.",
    "body": "The symptom is specific. Cues work perfectly with the app open. Then, on a device where the app targets Android 15, the user turns the screen off, the first background cue never plays, and `requestAudioFocus` returns `AUDIOFOCUS_REQUEST_FAILED`. Nothing crashes and nothing is logged unless you log it.\n\nThe cause is one documented sentence, and the fix is the foreground service a workout app arguably should have been running anyway.\n\n## The sentence\n\nGoogle's [`requestAudioFocus`](https://developer.android.com/reference/android/media/AudioManager) reference, the [`AudioFocusRequest`](https://developer.android.com/reference/android/media/AudioFocusRequest) reference and the [Manage audio focus](https://developer.android.com/media/optimize/audio-focus) guide all carry the same note:\n\n\"If an app targets Android 15 (API level 35) or higher, it cannot request audio focus unless it's the top app or running a foreground service. This requirement is similar to the existing requirements for audio playback. If an app requests audio focus when it does not meet these requirements, the method returns AUDIOFOCUS_REQUEST_FAILED.\"\n\nTwo conditions, either one sufficient: the app is the top app, or it is running a foreground service. A workout app with the screen off is not the top app. Unless it started a foreground service, it meets neither condition, and the focus request fails, quietly, by return value.\n\n## The other reason for AUDIOFOCUS_REQUEST_FAILED\n\nDo not assume every failure is this one. Google's guide documents a second cause that has nothing to do with targeting: \"Sometimes the system cannot grant a request for audio focus because the focus is \"locked\" by another app, such as during a phone call. In this case, requestAudioFocus() returns AUDIOFOCUS_REQUEST_FAILED.\"\n\n| When it fails | Likely cause | What to do |\n| --- | --- | --- |\n| Only with the screen off or the app backgrounded, targeting API level 35 or higher | Not top app and no foreground service | Run the workout in a foreground service |\n| During a phone call, in any state | Focus locked by another app | Skip the spoken cue; do not queue it for later |\n| Always, even in the foreground with no call | Neither documented cause; we found no third one documented | Log the request and device state before guessing |\n\nLog the return value with the app's state (foreground or background, foreground service running or not) and the first two rows separate themselves.\n\n## Choosing the foreground service type\n\nGoogle's [Foreground service types](https://developer.android.com/develop/background-work/services/fgs/service-types) page: \"Beginning with Android 14 (API level 34), you must declare an appropriate service type for each foreground service.\" That means declaring the type in the manifest, requesting the type's permission in addition to `FOREGROUND_SERVICE`, and, for some types, holding runtime permissions before you start it.\n\nTwo types are candidates for a workout app that speaks.\n\n| | Health | Media |\n| --- | --- | --- |\n| `android:foregroundServiceType` | `health` | `mediaPlayback` |\n| Manifest permission | `FOREGROUND_SERVICE_HEALTH` | `FOREGROUND_SERVICE_MEDIA_PLAYBACK` |\n| `startForeground()` constant | `FOREGROUND_SERVICE_TYPE_HEALTH` | `FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK` |\n| Runtime prerequisite | At least one: declare `HIGH_SAMPLING_RATE_SENSORS`, or hold one of `BODY_SENSORS` (API 35 and lower), `READ_HEART_RATE`, `READ_SKIN_TEMPERATURE`, `READ_OXYGEN_SATURATION`, `ACTIVITY_RECOGNITION` | None |\n| Google's description | \"Any long-running use cases to support apps in the fitness category such as exercise trackers.\" | \"Continue audio or video playback from the background.\" |\n\nFor health, Google adds a while-in-use caution: \"you cannot create a health foreground service that uses body sensors while your app is in the background, unless you've been granted the BODY_SENSORS_BACKGROUND (between API level 33 and API level 35) or READ_HEALTH_DATA_IN_BACKGROUND (API level 36) permissions.\" Start it when the user starts the workout, while the app is in front. For media: \"Apps that target Android 15 or higher are not allowed to launch a media playback foreground service from a BOOT_COMPLETED broadcast receiver.\"\n\n## Which one, in our judgement\n\nGoogle's focus note says \"running a foreground service\" and names no type, and we did not find a page restricting the exemption to `mediaPlayback`. The evidence we have therefore says any running foreground service satisfies the condition.\n\nOn that basis, the type should describe what the app is doing. A workout app tracking an exercise matches Google's own description of `health` (\"exercise trackers\"), and most already run one to keep sensors and the session clock alive. The cues ride on that service. The [Wear OS ExerciseClient walkthrough](/watch-apps/wear-os-exerciseclient-kotlin) uses the same pattern for the exercise itself.\n\n`mediaPlayback` fits an app whose product is audio: a guided-run or audio-class app with transport controls, a media session and a notification the user expects to control. Google's [Media3 background playback](https://developer.android.com/media/media3/session/background-playback) guide says such an app \"requires the FOREGROUND_SERVICE and FOREGROUND_SERVICE_MEDIA_PLAYBACK permissions\" and a service declared \"with an intent filter of MediaSessionService and a foregroundServiceType that includes mediaPlayback.\" Declaring `mediaPlayback` for an app that plays three-second cues makes a claim about the app that is not true.\n\nGoogle also notes that if your app targets Android 14 or higher, \"you'll need to declare your app's foreground service types in the Play Console's app content page,\" found under Policy, then App content. That is the store-facing half of the same decision.\n\n```xml\n<uses-permission android:name=\"android.permission.FOREGROUND_SERVICE\" />\n<uses-permission android:name=\"android.permission.FOREGROUND_SERVICE_HEALTH\" />\n\n<service\n    android:name=\".WorkoutService\"\n    android:foregroundServiceType=\"health\"\n    android:exported=\"false\" />\n```\n\n## Order of operations\n\nThe service has to be running before the first background cue asks for focus, so its start belongs to the moment the workout starts, not the moment the screen turns off. Our sequence:\n\n1. The user taps start, in the foreground. Check the health runtime prerequisite is met.\n2. Start the foreground service with `FOREGROUND_SERVICE_TYPE_HEALTH` and its ongoing notification; the Android ongoing-workout surfaces are covered in [Android live updates for a workout](/engagement/android-live-updates-workout).\n3. The cue scheduler lives in, or is owned by, that service.\n4. Each cue requests `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK`, plays only on `AUDIOFOCUS_REQUEST_GRANTED`, and abandons focus afterwards, as on [the MAY_DUCK page](/audio-coaching/android-audio-focus-may-duck).\n5. The workout ends: stop the service, then shut down any TextToSpeech instance.\n\n## Monday morning\n\nCheck your `targetSdk`. If it is 35 or higher, background cues need a running foreground service. Log every `requestAudioFocus` result with whether the app is in the foreground and whether your service is running. If the failures cluster in the background with no service, move the workout into a `health` foreground service started at workout start. Then run a full workout with the screen off from the first minute.",
    "faqs": [
      {
        "q": "Why does requestAudioFocus return AUDIOFOCUS_REQUEST_FAILED when my app is in the background?",
        "a": "If your app targets Android 15 or higher, that is the documented behaviour. Google's requestAudioFocus reference says such an app cannot request audio focus unless it's the top app or running a foreground service, and that the method returns AUDIOFOCUS_REQUEST_FAILED when the app does not meet those requirements. A screen-off workout is not the top app, so it needs a running foreground service. Google's audio focus guide documents a second cause of the same return value: focus locked by another app, such as during a phone call."
      },
      {
        "q": "Which foreground service type should a workout app use so its audio cues keep working?",
        "a": "Our recommendation is health, with mediaPlayback only for apps whose product is audio playback. Google's foreground service types page describes health as covering long-running use cases for fitness apps such as exercise trackers, with the FOREGROUND_SERVICE_HEALTH permission and a runtime prerequisite such as ACTIVITY_RECOGNITION. Google's audio focus note says running a foreground service and names no type, and we found no page limiting the exemption to mediaPlayback. Declare the type that describes what your app is actually doing."
      },
      {
        "q": "When should a workout app start its foreground service so background cues get audio focus?",
        "a": "When the user starts the workout, while the app is in front, not when the screen turns off. The focus request in the background only succeeds if the service is already running. Google also documents while-in-use limits for the health type: you cannot create a health foreground service that uses body sensors while your app is in the background unless you hold the background sensor or background health-data permission for your API level. Starting the service from the start button avoids both problems."
      }
    ],
    "related": [
      {
        "href": "/audio-coaching/android-audio-focus-may-duck",
        "label": "Requesting MAY_DUCK focus for cues"
      },
      {
        "href": "/audio-coaching/texttospeech-workout-cues-android",
        "label": "TextToSpeech workout cues"
      },
      {
        "href": "/watch-apps/wear-os-exerciseclient-kotlin",
        "label": "Wear OS ExerciseClient in Kotlin"
      },
      {
        "href": "/engagement/android-live-updates-workout",
        "label": "Android live updates for a workout"
      },
      {
        "href": "/test/background-sync",
        "label": "Testing background behaviour"
      }
    ],
    "cta": {
      "pitch": "Each Android release tightens what a backgrounded app may do. Our newsletter flags the changes that break workout apps before your crash-free numbers do."
    },
    "sources": [
      {
        "url": "https://developer.android.com/reference/android/media/AudioManager",
        "checked": "2026-10-03",
        "note": "Android 15 note on requestAudioFocus; return values"
      },
      {
        "url": "https://developer.android.com/reference/android/media/AudioFocusRequest",
        "checked": "2026-10-03",
        "note": "Android 15 note"
      },
      {
        "url": "https://developer.android.com/media/optimize/audio-focus",
        "checked": "2026-10-03",
        "note": "Android 15 note; focus locked during calls"
      },
      {
        "url": "https://developer.android.com/develop/background-work/services/fgs/service-types",
        "checked": "2026-10-03",
        "note": "health and mediaPlayback types, permissions, prerequisites, Play Console declaration"
      },
      {
        "url": "https://developer.android.com/media/media3/session/background-playback",
        "checked": "2026-10-03",
        "note": "MediaSessionService manifest declaration"
      }
    ]
  },
  {
    "slug": "texttospeech-workout-cues-android",
    "primaryQuery": "android texttospeech workout cues",
    "h1": "TextToSpeech workout cues on Android: initialization, focus, queue and completion",
    "metaTitle": "Android TextToSpeech Workout Cues: Focus, Queue, onDone",
    "metaDescription": "OnInitListener timing, the TTS_SERVICE queries element, QUEUE_FLUSH for stale cues, and releasing audio focus in onDone so the user's music comes back.",
    "updated": "2026-10-03",
    "answer": "Android's TextToSpeech can only speak after initialization completes, which Google signals through TextToSpeech.OnInitListener, and speak() is asynchronous: it only queues the request, so completion arrives through an UtteranceProgressListener keyed by the utterance id you pass. Google's reference does not say TextToSpeech manages audio focus, so a cue app requests AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK before speaking and abandons it in onDone, onStop or onError; Google documents that by onDone all audio has been played back. Set the cue's AudioAttributes with setAudioAttributes, use QUEUE_FLUSH when a newer cue makes the queued one stale, declare the android.intent.action.TTS_SERVICE intent in a queries element when targeting Android 11, and call shutdown() when the workout ends.",
    "body": "Android's built-in `TextToSpeech` is the quickest way to make a workout app talk, and it is asynchronous in more places than its method names suggest. The constructor returns before the engine is ready. `speak()` returns before anything is spoken. Completion arrives on a listener, possibly on another thread. And the reference says nothing about audio focus, so ducking the user's music is your job.\n\nThis page walks the lifecycle for coaching cues. The focus request itself is on [the MAY_DUCK page](/audio-coaching/android-audio-focus-may-duck), and the background restriction for apps targeting Android 15 is on [the AUDIOFOCUS_REQUEST_FAILED page](/audio-coaching/audiofocus-request-failed-android-15).\n\n## Initialization, and the callback that can come early\n\nGoogle's [`TextToSpeech`](https://developer.android.com/reference/android/speech/tts/TextToSpeech) reference: \"A TextToSpeech instance can only be used to synthesize text once it has completed its initialization. Implement the TextToSpeech.OnInitListener to be notified of the completion of the initialization.\"\n\nThe constructor's parameter documentation adds the detail that causes a confusing crash: \"In a case of a failure the listener may be called immediately, before TextToSpeech instance is fully constructed.\" If your `onInit` reads the property you are about to assign the instance to, a failure path can hit it while it is still null. Treat init status as data and keep `onInit` from touching the instance until construction has returned.\n\nCreate the engine when the workout screen opens, not when the first cue is due, so initialization is finished before anything needs saying.\n\n## Android 11: the queries element\n\nApps targeting Android 11 \"that use text-to-speech should declare TextToSpeech.Engine.INTENT_ACTION_TTS_SERVICE in the queries elements of their manifest,\" and Google gives the block:\n\n```xml\n<queries>\n  <intent>\n    <action android:name=\"android.intent.action.TTS_SERVICE\" />\n  </intent>\n</queries>\n```\n\n## Speaking a cue\n\n```kotlin\ntts.setAudioAttributes(cueAttributes)          // same attributes as the focus request\n\nfun speakCue(text: String, id: String) {\n    if (audioManager.requestAudioFocus(cueFocus) != AudioManager.AUDIOFOCUS_REQUEST_GRANTED) return\n    tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, id)\n}\n```\n\nGoogle documents `setAudioAttributes` as setting \"the audio attributes to be used when speaking text or playing back a file,\" returning `ERROR` or `SUCCESS`. Use the same attributes your focus request carries, as Google's focus guide recommends for any player.\n\n`speak(CharSequence, int, Bundle, String)` \"Speaks the text using the specified queuing strategy and speech parameters,\" and Google is explicit that it \"is asynchronous, i.e. the method just adds the request to the queue of TTS requests and then returns. The synthesis might not have finished (or even started!) at the time when this method returns.\" The text must be \"No longer than getMaxSpeechInputLength() characters,\" and the return value is `ERROR` or `SUCCESS` \"of queuing the speak operation,\" not of speaking it.\n\n## QUEUE_FLUSH or QUEUE_ADD\n\n| Queue mode | Google's description | Use it for |\n| --- | --- | --- |\n| `QUEUE_FLUSH` | \"all entries in the playback queue (media to be played and text to be synthesized) are dropped and replaced by the new entry,\" flushed \"with respect to a given calling app\" | A time-critical cue that makes anything still queued stale: \"go\", \"rest\", \"last set\" |\n| `QUEUE_ADD` | \"the new entry is added at the end of the playback queue\" | The second half of a cue you deliberately split, such as an exercise name followed by its target |\n\nOur judgement: default to `QUEUE_FLUSH` for workout cues. A queue that holds a cue past its moment delivers it late, and a late cue is wrong. Google notes the flush only affects your own app's entries: \"Entries in the queue from other callees are not discarded.\"\n\n## Knowing when it finished, so the music can come back\n\nCompletion arrives through [`UtteranceProgressListener`](https://developer.android.com/reference/android/speech/tts/UtteranceProgressListener), keyed by the utterance id you passed to `speak`. Google's `speak` documentation: \"In order to reliably detect errors during synthesis, we recommend setting an utterance progress listener.\" The listener's class note matters for threading: \"The callbacks specified in this method can be called from multiple threads.\"\n\n| Callback | Google's description | What a cue app does |\n| --- | --- | --- |\n| `onStart(utteranceId)` | Called when an utterance \"starts\" as perceived by the caller, \"soon before audio is played back\" | Nothing, or mark the cue delivered |\n| `onDone(utteranceId)` | \"All audio will have been played back by this point for audible output\" | Abandon audio focus, so the music unducks |\n| `onStop(utteranceId, interrupted)` | Called when an utterance \"has been stopped while in progress or flushed from the synthesis queue,\" including by `stop()` or `QUEUE_FLUSH` | Abandon focus if nothing else is queued |\n| `onError(utteranceId, errorCode)` | Called when an error has occurred during processing; Google notes there \"will never be a call to both onDone(String) and onError(String) for the same utterance\" | Abandon focus; fall back to a haptic |\n\n```kotlin\ntts.setOnUtteranceProgressListener(object : UtteranceProgressListener() {\n    override fun onStart(utteranceId: String) {}\n    override fun onDone(utteranceId: String) = release(utteranceId)\n    override fun onStop(utteranceId: String, interrupted: Boolean) = release(utteranceId)\n    @Deprecated(\"Deprecated in Java\")\n    override fun onError(utteranceId: String) = release(utteranceId)\n    override fun onError(utteranceId: String, errorCode: Int) = release(utteranceId)\n})\n```\n\n`onDone` is the right release point because of Google's wording: by then \"All audio will have been played back.\" Do not use `isSpeaking()` for this. Google warns that \"a speech item is considered complete once it's audio data has been sent to the audio mixer,\" and \"There might be a finite lag between this point, and when the audio hardware completes playback.\"\n\n## Languages and voices that are not there\n\n`setLanguage(Locale)` returns a support code, and Google notes the engine \"will try to use the closest match to the specified language as represented by the Locale, but there is no guarantee that the exact same Locale will be used.\" Two return values mean you will get no speech: `LANG_MISSING_DATA`, \"the language data is missing,\" and `LANG_NOT_SUPPORTED`. Separately, an utterance can fail with `ERROR_NOT_INSTALLED_YET`, \"a failure caused by an unfinished download of the voice data.\" Our judgement: check the language when the workout screen opens, and if it is missing, tell the user before the workout starts that cues will be tones and haptics, rather than discovering it at the first cue.\n\n## Rate, pauses and shutdown\n\n- `setSpeechRate(float)`: \"1.0 is the normal speech rate, lower values slow down the speech (0.5 is half the normal speech rate), greater values accelerate it (2.0 is twice the normal speech rate).\" Our judgement: expose it as a user setting rather than choosing a rate for everyone.\n- `playSilentUtterance(durationInMs, queueMode, utteranceId)` \"Plays silence for the specified amount of time,\" which is how to put a deliberate gap between two halves of a cue without a timer.\n- `stop()` \"Interrupts the current utterance (whether played or rendered to file) and discards other utterances in the queue.\" Call it when the user pauses.\n- `shutdown()` \"Releases the resources used by the TextToSpeech engine,\" and Google suggests calling it in `onDestroy()`. For a workout app, call it when the workout ends, from whatever owns the engine, which is often the foreground service rather than an activity.\n\n## Monday morning\n\nCreate the engine when the workout screen opens and confirm `onInit` cannot touch a half-built instance. Add the `TTS_SERVICE` queries element. Set the cue attributes on the engine and match them in the focus request. Speak with `QUEUE_FLUSH` and release focus in `onDone`, `onStop` and `onError`. Check the language before the workout starts. Then run a workout with music playing and listen for the music coming back after every cue.",
    "faqs": [
      {
        "q": "Does Android TextToSpeech duck the user's music automatically?",
        "a": "Not as far as Google's reference says. The TextToSpeech and UtteranceProgressListener references describe initialization, queuing, attributes and progress callbacks, and say nothing about audio focus. So treat ducking as your job: request AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK before calling speak, with the same AudioAttributes you set on the engine through setAudioAttributes, and abandon focus when the utterance finishes. On Android 8.0 and higher the system then ducks the music app for you."
      },
      {
        "q": "Should workout cues use QUEUE_FLUSH or QUEUE_ADD in TextToSpeech?",
        "a": "QUEUE_FLUSH for anything time-critical. Google documents QUEUE_FLUSH as dropping all entries in the playback queue and replacing them with the new entry, and QUEUE_ADD as adding the new entry at the end of the queue. A cue held in a queue behind a longer one is delivered late, and a late cue is wrong. Use QUEUE_ADD only for the second half of a cue you split on purpose. Google notes the flush only affects your own app's entries, not other callers'."
      },
      {
        "q": "Why does TextToSpeech setLanguage return LANG_MISSING_DATA?",
        "a": "Because the voice data for that language is not on the device. Google's reference documents LANG_MISSING_DATA as the language data being missing and LANG_NOT_SUPPORTED as the language not being supported, and notes that setLanguage tries the closest match to the locale with no guarantee of an exact one. An utterance can separately fail with ERROR_NOT_INSTALLED_YET, an unfinished download of the voice data. Check the language when the workout screen opens and tell the user before the workout if cues will be tones and haptics."
      },
      {
        "q": "Why does my TextToSpeech onInit callback run before the instance is assigned?",
        "a": "Because Google documents that it can. The TextToSpeech constructor's listener documentation says that in a case of a failure the listener may be called immediately, before the TextToSpeech instance is fully constructed. If onInit reads the property you are assigning the instance to, a failure path can find it still null. Record the init status in onInit and act on it only after construction has returned."
      }
    ],
    "related": [
      {
        "href": "/audio-coaching/android-audio-focus-may-duck",
        "label": "Requesting MAY_DUCK focus for cues"
      },
      {
        "href": "/audio-coaching/audioattributes-usage-coaching-cues",
        "label": "Which AudioAttributes usage to declare"
      },
      {
        "href": "/audio-coaching/avspeechsynthesizer-workout-cues",
        "label": "The iOS side: AVSpeechSynthesizer"
      },
      {
        "href": "/guides/ai-workout-tracking-android-kotlin",
        "label": "AI workout tracking on Android"
      },
      {
        "href": "/accessibility/talkback-workout-screens",
        "label": "TalkBack and the workout screen"
      }
    ],
    "cta": {
      "pitch": "TextToSpeech engines and Android's audio rules change underneath coaching apps. Our newsletter tracks what changes for spoken cues."
    },
    "steps": [
      {
        "name": "Create the engine early and handle init",
        "text": "Construct TextToSpeech with an OnInitListener when the workout screen opens. Google notes the listener may be called immediately on failure, before the instance is fully constructed."
      },
      {
        "name": "Declare the TTS service query",
        "text": "When targeting Android 11, add a queries element containing an intent with the action android.intent.action.TTS_SERVICE, as Google's reference shows."
      },
      {
        "name": "Set attributes and a progress listener",
        "text": "Call setAudioAttributes with your cue attributes and setOnUtteranceProgressListener with a listener whose onDone, onStop and onError release audio focus."
      },
      {
        "name": "Request focus, then speak with an id",
        "text": "Request AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK and, if granted, call speak with QUEUE_FLUSH and a unique utterance id so the callbacks can be matched."
      },
      {
        "name": "Shut down at workout end",
        "text": "Call stop() when the user pauses and shutdown() when the workout ends, which Google documents as releasing the resources used by the engine."
      }
    ],
    "sources": [
      {
        "url": "https://developer.android.com/reference/android/speech/tts/TextToSpeech",
        "checked": "2026-10-03",
        "note": "init, Android 11 queries, speak, queue modes, language codes, rate, shutdown"
      },
      {
        "url": "https://developer.android.com/reference/android/speech/tts/UtteranceProgressListener",
        "checked": "2026-10-03",
        "note": "callbacks, threads, onDone semantics"
      },
      {
        "url": "https://developer.android.com/media/optimize/audio-focus",
        "checked": "2026-10-03",
        "note": "requesting and abandoning focus"
      }
    ]
  },
  {
    "slug": "audioattributes-usage-coaching-cues",
    "primaryQuery": "audioattributes usage for voice coaching",
    "h1": "Which AudioAttributes usage a workout coaching cue should declare",
    "metaTitle": "AudioAttributes USAGE_ for Coaching Cues: Which to Pick",
    "metaDescription": "USAGE_ASSISTANCE_NAVIGATION_GUIDANCE, USAGE_ASSISTANT or USAGE_MEDIA: what Google documents each usage changes, and our pick for cues, tones and sessions.",
    "updated": "2026-10-03",
    "answer": "Usage is, in Google's words, the most important information to supply in AudioAttributes, and it changes how Android treats your cue. Google describes USAGE_ASSISTANCE_NAVIGATION_GUIDANCE as driving or navigation directions, USAGE_ASSISTANT as audio responses to user queries, audio instructions or help utterances, USAGE_ASSISTANCE_SONIFICATION as user interface sounds, and USAGE_MEDIA as music or movie soundtracks; a focus request with no attributes defaults to USAGE_MEDIA. Android 12's forced fade-out and incoming-call mute apply to USAGE_MEDIA and USAGE_GAME players, and CONTENT_TYPE_SPEECH stops the system ducking a player automatically. No usage names exercise coaching, so our judgement is navigation guidance with speech content for spoken cues, sonification for tones, and media for long guided sessions.",
    "body": "Every Android player and every focus request carries an `AudioAttributes`, and most cue code fills it in by copying the first snippet it finds. The usage you pick is not a label. It changes whether Android 12's forced fade-out applies to you, whether you are muted during a call, whether other apps can capture your audio, and how the system treats the user's music while you speak.\n\nGoogle publishes no usage constant that names exercise coaching. So this is the one page in the cluster where the recommendation is mostly ours, and it shows the documented facts it rests on.\n\n## What usage and content type mean\n\nGoogle's [`AudioAttributes`](https://developer.android.com/reference/android/media/AudioAttributes) reference: usage is \"\"why\" you are playing a sound, what is this sound used for,\" and \"Usage is the most important information to supply in AudioAttributes and it is recommended to build any instance with this information supplied.\" Content type is \"\"what\" you are playing,\" which \"is optional,\" and which \"might be used by the audio framework to selectively configure some audio post-processing blocks.\" Attributes \"supersede the notion of stream types.\"\n\n## The candidates, in Google's words\n\n| Constant | Google's description | Documented consequence that matters here |\n| --- | --- | --- |\n| `USAGE_MEDIA` | \"the usage is media, such as music, or movie soundtracks\" | Subject to Android 12's forced fade-out and incoming-call mute; the default when a focus request sets no attributes; may be captured by other apps |\n| `USAGE_ASSISTANCE_NAVIGATION_GUIDANCE` | \"the usage is driving or navigation directions\" | Excluded from capture for privacy |\n| `USAGE_ASSISTANT` | \"audio responses to user queries, audio instructions or help utterances\" (added in API level 26) | Excluded from capture for privacy |\n| `USAGE_ASSISTANCE_SONIFICATION` | \"sonification, such as with user interface sounds\" | Excluded from capture for privacy |\n| `USAGE_NOTIFICATION` | \"the usage is notification\" | Excluded from capture for privacy |\n| `USAGE_ASSISTANCE_ACCESSIBILITY` | \"for accessibility, such as with a screen reader\" | Not for coaching: it describes a screen reader |\n\nContent types that matter: `CONTENT_TYPE_SPEECH`, \"the content type is speech\"; `CONTENT_TYPE_SONIFICATION`, \"a sound used to accompany a user action, such as a beep or sound effect\"; and `CONTENT_TYPE_MUSIC`.\n\n## Documented consequence 1: the Android 12 rules key on USAGE_MEDIA\n\nGoogle's [Manage audio focus](https://developer.android.com/media/optimize/audio-focus) guide describes two system behaviours on Android 12 and higher, and both are scoped by usage. The forced fade-out applies when the playing app \"has either the AudioAttributes.USAGE_MEDIA or AudioAttributes.USAGE_GAME usage attribute,\" and another app requests `AUDIOFOCUS_GAIN`. The incoming-call mute applies to an app that \"has either the AudioAttributes.USAGE_MEDIA or AudioAttributes.USAGE_GAME usage attribute,\" has focus, and is playing: \"its playback is muted until the call ends.\"\n\nFor a cue played with `USAGE_MEDIA`, the call mute is arguably what you want. For a long guided session it is exactly what you want. Either way, it is a behaviour you get or lose by choosing the usage.\n\n## Documented consequence 2: CONTENT_TYPE_SPEECH changes how you are ducked\n\nThe same guide: automatic ducking only happens when the playing app \"is not playing audio with content type AudioAttributes.CONTENT_TYPE_SPEECH.\" The [`AudioFocusRequest`](https://developer.android.com/reference/android/media/AudioFocusRequest) reference says this \"behavior is independent of the use of AudioFocusRequest, but tied to the use of AudioAttributes,\" and that speech players get `AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK` through their listener \"so they can pause instead.\"\n\nThis matters if your app plays long spoken content of its own: a guided run, an audio class. Mark it `CONTENT_TYPE_SPEECH` and a navigation prompt or a notification will not talk over your coach; your listener gets the chance to pause. The flip side is that you must implement that listener, because the system will no longer duck you.\n\nFor a three-second cue, the content type of your own player barely matters to ducking; what matters is the content type of the app you are interrupting.\n\n## Documented consequence 3: capture\n\nThe reference's capture policy note: \"For privacy, the following usages cannot be recorded: VOICE_COMMUNICATION*, USAGE_NOTIFICATION*, USAGE_ASSISTANCE* and USAGE_ASSISTANT.\" And on Android 10: \"only USAGE_UNKNOWN, USAGE_MEDIA and USAGE_GAME may be captured.\" If your users record their workouts with a screen-recording or streaming app and expect the coaching voice in the recording, an assistance usage will leave it out. That is a product consideration, not a reason to pick one usage over another.\n\n## Google's general guidance points the other way\n\nGoogle's [Handling changes in audio output](https://developer.android.com/media/platform/output) guide gives broader advice: \"Unless your app is an alarm clock, you should play audio with usage AudioAttributes.USAGE_MEDIA,\" so that the volume keys adjust the right stream, using `setVolumeControlStream()` with the stream from `AudioAttributes.getVolumeControlStream`. That sentence is written for apps whose audio is media. It is also the strongest general instruction Google gives, and we are not going to pretend it does not exist.\n\nWhat we could not verify is which volume stream each assistance usage maps to on current devices. That decides which volume the user's buttons change while a cue plays, and it is the part to test on hardware before you commit.\n\n## Our recommendation\n\nWhat follows is judgement, built on the facts above.\n\n| What you are playing | Usage | Content type | Why |\n| --- | --- | --- | --- |\n| Short spoken cue over the user's music | `USAGE_ASSISTANCE_NAVIGATION_GUIDANCE` | `CONTENT_TYPE_SPEECH` | The same shape as Google's own example for transient ducking focus: brief spoken directions over music |\n| Beep, countdown tick, interval chime | `USAGE_ASSISTANCE_SONIFICATION` | `CONTENT_TYPE_SONIFICATION` | Google's description of both constants fits a short sound accompanying an event |\n| Long guided session or audio class | `USAGE_MEDIA` | `CONTENT_TYPE_SPEECH` | It is media; the call mute applies; speech content type means others pause rather than talk over it |\n| The app's own music bed | `USAGE_MEDIA` | `CONTENT_TYPE_MUSIC` | It is music, and should be ducked by other apps' prompts like any other |\n\n`USAGE_ASSISTANT` is a defensible alternative for spoken cues: \"audio instructions\" is close to what a coach says. We lean to navigation guidance because Google's transient-ducking examples are written around it. Whatever you choose, use the same attributes in the focus request and the player; Google's focus guide says to, and a mismatch means the focus request describes a different sound from the one you play.\n\n```kotlin\nval spokenCue = AudioAttributes.Builder()\n    .setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE)\n    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)\n    .build()\n\nval tone = AudioAttributes.Builder()\n    .setUsage(AudioAttributes.USAGE_ASSISTANCE_SONIFICATION)\n    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)\n    .build()\n```\n\n## Monday morning\n\nList every `AudioAttributes.Builder` in the app and write down what each one plays. Make cue, tone, guided-session and music-bed attributes four named constants instead of inline builders. Pass the same constant to the player and the focus request. Then, on a real device, press the volume keys while a cue is speaking and confirm the user is changing the volume they expect; that is the part no reference we read could tell us.",
    "faqs": [
      {
        "q": "Which AudioAttributes usage should a spoken workout cue use?",
        "a": "There is no documented answer, so this is our judgement: USAGE_ASSISTANCE_NAVIGATION_GUIDANCE with CONTENT_TYPE_SPEECH. Google describes that usage as driving or navigation directions, and Google's own examples for transient ducking focus are spoken directions over music, which is the shape of a coaching cue. USAGE_ASSISTANT, described as audio instructions or help utterances, is a defensible alternative. Whichever you choose, use the same attributes in the focus request and the player, and check on a device which volume the hardware keys change while a cue plays."
      },
      {
        "q": "Does CONTENT_TYPE_SPEECH stop my guided run audio from being ducked by other apps?",
        "a": "Yes, by design. Google's audio focus guide says automatic ducking only applies when the playing app is not playing CONTENT_TYPE_SPEECH content, and the AudioFocusRequest reference says speech players are instead notified with AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK so they can pause. Google adds that this is tied to the AudioAttributes, not to whether you use AudioFocusRequest. So a guided session marked as speech will not be talked over by a navigation prompt, but you must implement the listener and pause, because the system will not duck you."
      },
      {
        "q": "What usage does an Android AudioFocusRequest use if I do not set attributes?",
        "a": "USAGE_MEDIA. Google's audio focus guide and the AudioFocusRequest reference both say that if no attributes are set, the request uses AudioAttributes.USAGE_MEDIA. That matters because Android 12's forced fade-out and the incoming-call mute both apply to USAGE_MEDIA and USAGE_GAME players. Google also recommends using the same attributes in the focus request as in your player, so leaving them unset on one side and set on the other means the request describes a different sound from the one you play."
      }
    ],
    "related": [
      {
        "href": "/audio-coaching/android-audio-focus-may-duck",
        "label": "Requesting MAY_DUCK focus for cues"
      },
      {
        "href": "/audio-coaching/texttospeech-workout-cues-android",
        "label": "TextToSpeech workout cues"
      },
      {
        "href": "/audio-coaching/avaudiosession-category-workout-app",
        "label": "The iOS counterpart: session categories"
      },
      {
        "href": "/guides/ai-workout-tracking-android-kotlin",
        "label": "AI workout tracking on Android"
      },
      {
        "href": "/build/running-app",
        "label": "How to build a running app"
      }
    ],
    "cta": {
      "pitch": "Android keeps adding behaviour keyed on AudioAttributes. Our newsletter tracks the changes that alter how a coaching cue is treated."
    },
    "sources": [
      {
        "url": "https://developer.android.com/reference/android/media/AudioAttributes",
        "checked": "2026-10-03",
        "note": "usage and content type definitions; capture policy"
      },
      {
        "url": "https://developer.android.com/media/optimize/audio-focus",
        "checked": "2026-10-03",
        "note": "Android 12 fade-out and call mute scoped by usage; automatic ducking conditions"
      },
      {
        "url": "https://developer.android.com/reference/android/media/AudioFocusRequest",
        "checked": "2026-10-03",
        "note": "default USAGE_MEDIA; speech not ducked"
      },
      {
        "url": "https://developer.android.com/media/platform/output",
        "checked": "2026-10-03",
        "note": "general guidance to play audio with USAGE_MEDIA"
      }
    ]
  },
  {
    "slug": "wear-os-watchos-workout-audio",
    "primaryQuery": "wear os workout audio cues speaker",
    "h1": "Audio cues on the wrist: Wear OS speakers, Bluetooth, and Apple Watch workout sessions",
    "metaTitle": "Wear OS and watchOS Workout Audio: Speaker or Bluetooth",
    "metaDescription": "Google lets fitness apps speak exercise instructions on a Wear OS speaker but keeps media on Bluetooth; Apple ties watch cues to the workout session.",
    "updated": "2026-10-03",
    "answer": "The two watch platforms draw the line in different places. Google's Wear OS audio guide says to play media only when Bluetooth headphones or speakers are connected, but encourages non-media sound on the built-in speaker and gives fitness apps providing exercise instructions as its example; you find outputs with AudioManager.getDevices and types such as TYPE_BUILTIN_SPEAKER and TYPE_BLUETOOTH_A2DP. Apple documents that watchOS workout apps can play short clips such as coaching in the background only while an active workout session is running, that the Audio background mode is required alongside Workout processing if the session plays audio or haptics, and that long-form background audio requires a Bluetooth route.",
    "body": "On a phone, the audio question is how to share the channel with the user's music. On a watch, there is an earlier question: where does the sound come out? Google's Wear OS guide says \"Most Wear OS devices have built-in speakers,\" earbuds can be paired straight to the watch, and the two platforms draw the line between speaker and headset in different places.\n\nThis page covers audio output for workout cues on Wear OS and Apple Watch. Running the workout itself belongs to [watch apps](/watch-apps): [HKWorkoutSession lifecycle](/watch-apps/hkworkoutsession-lifecycle-swift) on watchOS and the [ExerciseClient walkthrough](/watch-apps/wear-os-exerciseclient-kotlin) on Wear OS.\n\n## Wear OS: find out what outputs exist\n\nGoogle's [Play audio on wearables](https://developer.android.com/training/wearables/apps/audio) guide starts with detection: \"A Wear OS app must first detect if the wearable device has an appropriate audio output.\" Wearables \"typically have at least one of\" these outputs:\n\n- `AudioDeviceInfo.TYPE_BUILTIN_SPEAKER`, \"on devices with a built-in speaker\"\n- `AudioDeviceInfo.TYPE_BLUETOOTH_A2DP`, \"when a Bluetooth headset is paired and connected\"\n- `AudioDeviceInfo.TYPE_BLE_BROADCAST`, `TYPE_BLE_HEADSET` and `TYPE_BLE_SPEAKER` for Bluetooth Low Energy devices\n\n```kotlin\nfun audioOutputAvailable(type: Int): Boolean {\n    if (!packageManager.hasSystemFeature(PackageManager.FEATURE_AUDIO_OUTPUT)) return false\n    return audioManager.getDevices(AudioManager.GET_DEVICES_OUTPUTS).any { it.type == type }\n}\n```\n\nThat is Google's sample, lightly trimmed: check `FEATURE_AUDIO_OUTPUT`, then look for the device type among the outputs.\n\n## Wear OS: cues may use the speaker, media should not\n\nThe guide separates media from everything else. For media: \"To provide the best user experience, only play media when Bluetooth headphones or speakers are connected to the watch.\" And: \"Built-in speakers don't deliver the optimal experience for listening to media content because they aren't designed for this purpose.\"\n\nFor non-media sound, the guide is permissive, and it names our use case: \"If your app offers a non-media use case that uses sound, consider using speakers to offer an extra dimension of engagement. For example, a speaker-equipped Wear OS device might trigger a clock or timer alarm with an audio notification, and fitness apps might use the speaker to provide exercise instructions.\"\n\n| What the watch app plays | Built-in speaker | Bluetooth headset |\n| --- | --- | --- |\n| Short exercise instruction or interval cue | Google's guide gives this as an example of speaker use | Yes, if connected |\n| Music, a guided run, an audio class | Google says to play media only with Bluetooth connected | Yes |\n\n## Wear OS: when the headset comes and goes\n\nBluetooth headsets connect and disconnect mid-run. Google: \"If your app requires a headset to continue, register a callback to detect when the user connects and disconnects a Bluetooth headset using registerAudioDeviceCallback.\" Its sample checks the A2DP and BLE types in `onAudioDevicesAdded` and `onAudioDevicesRemoved`.\n\nWhen there is no headset and the user wants media, Google is specific about tone: \"don't show an error message. Instead, offer to take the user directly to Bluetooth settings,\" using `Settings.ACTION_BLUETOOTH_SETTINGS`. \"Starting with Wear OS 5, the system provides a UI that lets users choose which device plays media,\" and Google suggests offering that media output switcher where it is available.\n\n## Wear OS: stop media leaking out of the speaker\n\nFor apps that play media through ExoPlayer, Google documents a guard: call `setSuppressPlaybackOnUnsuitableOutput(true)` while building the player, and add `WearUnsuitableOutputPlaybackSuppressionResolverListener` as a listener. Google also notes that if you target Android 15 or higher, \"the media output switcher provides the watch's built-in speakers as one of the selectable options on supported Wear OS devices,\" and that supporting this with ExoPlayer needs \"version 1.5.0 or later.\"\n\n```kotlin\nval exoPlayer = ExoPlayer.Builder(context)\n    .setAudioAttributes(AudioAttributes.DEFAULT, true)\n    .setSuppressPlaybackOnUnsuitableOutput(true)\n    .build()\nexoPlayer.addListener(WearUnsuitableOutputPlaybackSuppressionResolverListener(context))\n```\n\nFor other players, Google's list is plain: start media only when a suitable output is connected, pause if it disconnects, and prompt the user to connect one if they try to play without it. Once a suitable output is chosen, \"playing audio on Wear OS is the same as on mobile,\" including \"managing audio focus,\" which is covered on [the MAY_DUCK page](/audio-coaching/android-audio-focus-may-duck).\n\n## Apple Watch: cues belong to the workout session\n\nApple's [Running workout sessions](https://developer.apple.com/documentation/healthkit/running-workout-sessions) article makes the session the gate. \"Workout sessions require the Workout processing background mode. If your app plays audio or provides haptic feedback during the workout session, you must also add the Audio background mode.\" Apple says to \"Use the AVAudioPlayer class to play short audio clips,\" and notes that workout apps \"can use the AVFoundation framework to play short audio clips in the background, such as coaching or notifications. In order to play an audio clip, an active workout session must be running; any attempt to play background audio outside a workout session are invalid.\" The same article lists, among what a session gives you: \"Your app can alert the user using audio or haptic feedback while running in the background.\"\n\nApple's [Playing audio guidelines](https://developer.apple.com/design/human-interface-guidelines/playing-audio) describe the watch in two modes: \"An app can play short audio clips while it's active and running in the foreground, or it can play longer audio that continues even when people lower their wrist or switch to another app.\"\n\n## Apple Watch: long-form audio needs Bluetooth\n\nFor the second mode, Apple's [Playing Background Audio](https://developer.apple.com/documentation/watchkit/playing-background-audio) article sets the session category to `playback` with the route-sharing policy `.longFormAudio`, then activates asynchronously:\n\n```swift\ntry session.setCategory(.playback, mode: .default, policy: .longFormAudio, options: [])\ntry await session.activate()\n```\n\nApple: \"watchOS requires a Bluetooth audio route for long-form audio. If necessary, the system presents an audio route picker to the user.\" And: \"If no applicable Bluetooth route is selected (either automatically or by the user), the system passes an error to the completion handler.\" So a guided run on the watch has to handle the no-headphones case as an error path, not a crash and not a silent failure.\n\n## The two platforms side by side\n\n| Question | Wear OS (Google's guide) | watchOS (Apple's docs) |\n| --- | --- | --- |\n| Short cues on the built-in speaker | Allowed; fitness exercise instructions given as an example | Short clips via AVAudioPlayer, in the background only during an active workout session |\n| Long-form media | Only with Bluetooth or another suitable output connected | Requires a Bluetooth route; activation fails with an error if none is selected |\n| Background permission | When targeting API level 35 or higher, background focus requests need a foreground service; see [the Android 15 focus page](/audio-coaching/audiofocus-request-failed-android-15) | Workout processing mode, plus Audio if the session plays audio or haptics |\n| Headset leaves | `registerAudioDeviceCallback` | Route change handling, as on [the headphones page](/audio-coaching/headphones-disconnect-route-change) |\n\nOur judgement for both: on the wrist, a cue is often better as a haptic than as a sound, because the device is touching the skin. The wrist is where [haptics as a second channel](/accessibility/haptics-when-audio-is-busy) make the most sense, so the default should be haptic plus optional voice, not the reverse.\n\n## Monday morning\n\nOn Wear OS, detect outputs at workout start, route short cues to whatever is available, and keep media behind a Bluetooth check with a route to settings rather than an error. On watchOS, confirm the Audio background mode is present next to Workout processing, that cue clips only play while the session is running, and that any long-form audio handles the no-Bluetooth error. Then run a workout on each watch with no earbuds paired.",
    "faqs": [
      {
        "q": "Can a Wear OS fitness app speak exercise cues through the watch's built-in speaker?",
        "a": "Yes, Google's guide encourages it for non-media sound. The Play audio on wearables guide says that if your app offers a non-media use case that uses sound, you can consider using speakers, and gives fitness apps using the speaker to provide exercise instructions as an example. Media is different: Google says to play media only when Bluetooth headphones or speakers are connected, because built-in speakers are not designed for listening to media. Detect the available outputs with AudioManager.getDevices before choosing."
      },
      {
        "q": "Can an Apple Watch workout app play audio cues in the background?",
        "a": "Yes, while a workout session is running. Apple's Running workout sessions article says workout apps can use AVFoundation to play short audio clips in the background, such as coaching or notifications, but that an active workout session must be running, and attempts to play background audio outside a session are invalid. The same article says that if your app plays audio or provides haptic feedback during the session, you must add the Audio background mode as well as Workout processing."
      },
      {
        "q": "Why does my watchOS long-form audio session fail to activate?",
        "a": "Most likely there is no Bluetooth route. Apple's Playing Background Audio article says watchOS requires a Bluetooth audio route for long-form audio, set up with the playback category and the longFormAudio route-sharing policy, and that activation may show a route picker. If no applicable Bluetooth route is selected, automatically or by the user, the system passes an error to the completion handler. Treat that as a normal path: offer to connect headphones or fall back to short cues and haptics."
      }
    ],
    "related": [
      {
        "href": "/watch-apps/hkworkoutsession-lifecycle-swift",
        "label": "HKWorkoutSession lifecycle"
      },
      {
        "href": "/watch-apps/wear-os-exerciseclient-kotlin",
        "label": "Wear OS ExerciseClient in Kotlin"
      },
      {
        "href": "/watch-apps/watch-platform-differences",
        "label": "Watch platform differences"
      },
      {
        "href": "/accessibility/haptics-when-audio-is-busy",
        "label": "Haptics when the audio channel is busy"
      },
      {
        "href": "/engagement/wear-os-ongoing-activity",
        "label": "Wear OS ongoing activity"
      }
    ],
    "cta": {
      "pitch": "Watch audio rules shift with every Wear OS and watchOS release. Our newsletter tracks the changes that affect cues on the wrist."
    },
    "sources": [
      {
        "url": "https://developer.android.com/training/wearables/apps/audio",
        "checked": "2026-10-03",
        "note": "output detection, speaker for exercise instructions, media on Bluetooth, ExoPlayer suppression"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/running-workout-sessions",
        "checked": "2026-10-03",
        "note": "audio mode, short clips only during a session"
      },
      {
        "url": "https://developer.apple.com/documentation/watchkit/playing-background-audio",
        "checked": "2026-10-03",
        "note": "longFormAudio policy, Bluetooth route required"
      },
      {
        "url": "https://developer.apple.com/design/human-interface-guidelines/playing-audio",
        "checked": "2026-10-03",
        "note": "watchOS short clips versus longer audio"
      }
    ]
  },
  {
    "slug": "testing-workout-audio-cues",
    "primaryQuery": "testing workout audio cues",
    "h1": "Testing workout audio cues: calls, Siri, Bluetooth and the podcast that never resumes",
    "metaTitle": "Testing Workout Audio Cues: Calls, Bluetooth, Siri",
    "metaDescription": "A device test matrix for workout audio cues on iOS and Android, built from documented events: calls, Siri, podcasts, unplugged earbuds, Android 15 focus.",
    "updated": "2026-10-03",
    "answer": "Audio cue bugs live in transitions a desk test never triggers, so the test plan is a list of documented platform events caused on purpose, each with an expected result from the platform's documentation. On iOS that means a screen lock with music playing, a podcast app playing, an incoming call in both banner and full-screen styles, Siri listening, which Apple documents as setting promptStyle to none, headphones being removed, and Apple's own Reset Media Services item in the Developer menu of Settings. On Android it means a background cue from an app targeting API level 35, speech content playing, a phone call, headphones removed and a missing TTS voice. Keep the cue decision a pure function you unit-test, and test the delivery on devices.",
    "body": "Audio cue bugs do not live in the cue. They live in transitions: the screen locking, a call arriving, Siri listening, a podcast that should pause and resume, an earbud falling out, an Android build targeting a newer API level. A desk test with the screen on and nothing else playing triggers none of them. So the test plan is a list of documented platform events, each caused on purpose, each with an expected result taken from the platform's own documentation.\n\nThis page is that list. Each row links to the page that explains the behaviour.\n\n## What can be unit-tested, and what cannot\n\nSplit the cue system in two. The decision (\"given the workout time, the prompt style, whether focus was granted and whether headphones are connected, should this cue be speech, a tone, a haptic or nothing?\") is a pure function. Test it exhaustively in your normal suite, alongside the rest of [test](/test). The delivery, meaning the session, focus, route and engine, can only be tested on a device, because every interesting input comes from the operating system.\n\n```swift\nenum CueOutput { case speech, tone, haptic, skip }\n\nfunc output(promptStyle: AVAudioSession.PromptStyle,\n            headphonesConnected: Bool,\n            speakerOptIn: Bool) -> CueOutput {\n    switch promptStyle {\n    case .none:   return .haptic\n    case .short:  return .tone\n    default:      return (headphonesConnected || speakerOptIn) ? .speech : .haptic\n    }\n}\n```\n\nThe mapping from `promptStyle` comes from Apple's descriptions of the three styles, set out on [the AVSpeechSynthesizer page](/audio-coaching/avspeechsynthesizer-workout-cues). The headphones branch is our judgement from [the route-change page](/audio-coaching/headphones-disconnect-route-change).\n\n## The iOS device matrix\n\n| Cause this | How | Expected, per Apple | Assert in your app |\n| --- | --- | --- | --- |\n| Screen lock with music playing | Start music, start a workout, lock | `playback` audio continues when the screen locks, with `audio` in UIBackgroundModes | Every cue plays; music ducks and returns ([background audio](/audio-coaching/background-audio-workout-app-ios)) |\n| A podcast is playing | Play a podcast app, then trigger a cue | `interruptSpokenAudioAndMixWithOthers` pauses spokenAudio sessions while you are active; the system resumes them after you deactivate | The podcast resumes after each cue ([duckOthers](/audio-coaching/avaudiosession-duckothers-workout-cues)) |\n| Incoming call, banner style | Call the device | With `setPrefersNoInterruptionsFromSystemAlerts(true)`, the session is interrupted only if the user accepts | Cues pause only on accept |\n| Incoming call, full-screen style | Switch the call display style, call again | The preference \"has no effect\"; the system interrupts the session | Speech suspended; workout clock unaffected ([interruptions](/audio-coaching/audio-interruptions-during-workout-ios)) |\n| Siri listening | Invoke Siri mid-interval | `promptStyle` is `.none` while another session uses the microphone | No speech or tone; haptic fires |\n| A voice call in progress | Join a call, then trigger a cue | `promptStyle` is `.short` \"when a voice call is active\" | A tone, not words |\n| Wired or Bluetooth headphones removed | Unplug or power off mid-cue | `routeChangeNotification` with `oldDeviceUnavailable`, posted on a secondary thread | Speech stops; workout continues; no stale cues on reconnect |\n| Media services reset | Settings, then Developer, then Reset Media Services | `mediaServicesWereResetNotification`; reinitialize audio objects and reset category, options and mode | Next cue plays without restarting the app |\n\nThe last row is a test Apple documents directly. The [`mediaServicesWereResetNotification`](https://developer.apple.com/documentation/avfaudio/avaudiosession/mediaserviceswereresetnotification) page: \"You can trigger a media server reset by choosing the \"Reset Media Services\" selection under the Developer menu in the iOS Settings app. Using this utility helps to ensure that your app responds appropriately if media services were reset.\" Most audio code has never been through it.\n\n## The Android device matrix\n\n| Cause this | How | Expected, per Google | Assert in your app |\n| --- | --- | --- | --- |\n| Background cue, app targeting API level 35 or higher | Screen off, no foreground service | `requestAudioFocus` returns `AUDIOFOCUS_REQUEST_FAILED` | With the workout's foreground service running, the cue plays ([Android 15](/audio-coaching/audiofocus-request-failed-android-15)) |\n| Music playing | Play music, trigger a cue | On Android 8.0 and higher, a `MAY_DUCK` request ducks the music automatically and restores it on abandon | Music ducks and returns ([MAY_DUCK](/audio-coaching/android-audio-focus-may-duck)) |\n| Speech content playing | Play a podcast or audiobook app | No automatic ducking of `CONTENT_TYPE_SPEECH`; that app's listener gets `AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK` | Whatever the other app does, your cue still plays and focus is abandoned |\n| Phone call | Call the device mid-workout | Focus may be locked; `requestAudioFocus` returns `AUDIOFOCUS_REQUEST_FAILED` | Cue skipped, haptic fires, not replayed after the call |\n| Headphones removed | Unplug, or disconnect a Bluetooth headset | `ACTION_AUDIO_BECOMING_NOISY` broadcast | Speech stops; workout continues |\n| TTS voice missing | Set a language with no installed voice | `setLanguage` returns `LANG_MISSING_DATA` or `LANG_NOT_SUPPORTED` | User told before the workout starts ([TextToSpeech](/audio-coaching/texttospeech-workout-cues-android)) |\n| Wear OS watch, no earbuds | Run with nothing paired | Media should play only with a suitable output; short cues may use the speaker | Cues play on the speaker or as haptics; media offers Bluetooth settings ([watch audio](/audio-coaching/wear-os-watchos-workout-audio)) |\n\nTwo Android rows depend on the OS version, so run them on at least one device below Android 12 and one on Android 12 or later: Google's guide says audio focus is \"not managed by the system\" before Android 12, and the forced fade-out and call mute arrive with it.\n\n## Logging that makes field reports useful\n\nThe matrix catches what you can cause. Field reports catch the rest, but only if the log has the inputs. Our judgement on what to log per cue, on both platforms:\n\n- scheduled time and actual time played, or why it was skipped\n- the focus request result on Android, or whether activation threw on iOS\n- `promptStyle` on iOS\n- the current output route\n- app state: foreground or background, and on Android whether the foreground service was running\n\nWith those five fields, most \"the coach went quiet\" reports can be matched to a row in one of the tables above.\n\n## Who should run it\n\nRun the matrix on real devices, with the screen locked, for a full workout, not in short bursts with the screen on. That is our recommendation, not something either platform states. The device-lab mechanics are in [device lab and CI](/test/device-lab-and-ci); watch-specific setup is in [testing watch apps](/watch-apps/testing-watch-apps); and accessibility testing of the same flows, including a screen reader talking over your cues, is in [testing accessibility](/accessibility/testing-accessibility-fitness-app).\n\n## Monday morning\n\nExtract the cue decision into a pure function and give it a table-driven test. Print the two device matrices and walk one device through each before the next release, starting with Reset Media Services on iOS and a screen-off cue on an Android build targeting API level 35. Add the five log fields. Then hand the matrix to whoever does release testing, because none of these rows will ever fail on a developer's desk.",
    "faqs": [
      {
        "q": "How do I test my iOS app's response to a media services reset?",
        "a": "Use the switch Apple documents for it. Apple's mediaServicesWereResetNotification page says you can trigger a media server reset by choosing Reset Media Services under the Developer menu in the iOS Settings app, and that doing so helps ensure your app responds appropriately. Apple says to respond by reinitializing your audio objects and resetting the session's category, options and mode, and notes you don't need to re-register for audio session notifications. Run it mid-workout and confirm the next cue plays without restarting the app."
      },
      {
        "q": "What should I test before shipping workout audio cues on an app targeting Android 15?",
        "a": "A cue with the screen off. Google documents that an app targeting Android 15 or higher cannot request audio focus unless it's the top app or running a foreground service, and gets AUDIOFOCUS_REQUEST_FAILED otherwise, so a screen-off cue without a running foreground service fails silently. Test it with and without your workout's foreground service, log every focus result with the app state, and also test a phone call, which locks focus and produces the same return value for a different reason."
      },
      {
        "q": "Which audio events should a workout app test on a real device before release?",
        "a": "Our list, built from what the platforms document: a full workout with the screen locked and music playing; a podcast app playing, which should pause and resume around each cue; an incoming call, in both call display styles on iOS; Siri or another microphone user mid-interval; wired and Bluetooth headphones removed mid-cue; and, on Android, a device below Android 12 and one at Android 12 or later, because Google documents that audio focus is only managed by the system from Android 12."
      }
    ],
    "related": [
      {
        "href": "/test/device-lab-and-ci",
        "label": "Device lab and CI"
      },
      {
        "href": "/watch-apps/testing-watch-apps",
        "label": "Testing watch apps"
      },
      {
        "href": "/accessibility/testing-accessibility-fitness-app",
        "label": "Testing accessibility in a fitness app"
      },
      {
        "href": "/audio-coaching/audio-interruptions-during-workout-ios",
        "label": "Audio interruptions on iOS"
      },
      {
        "href": "/audio-coaching/audiofocus-request-failed-android-15",
        "label": "AUDIOFOCUS_REQUEST_FAILED on Android 15"
      }
    ],
    "cta": {
      "pitch": "New OS releases add new ways for audio cues to fail. Our newsletter flags the platform changes that should add a row to your test matrix."
    },
    "steps": [
      {
        "name": "Extract the cue decision",
        "text": "Make the choice between speech, tone, haptic and skip a pure function of prompt style, focus result, route and settings, and cover it with a table-driven unit test."
      },
      {
        "name": "Run the iOS matrix on a device",
        "text": "Lock the screen with music playing, play a podcast, take calls in banner and full-screen styles, invoke Siri, remove headphones, and use Reset Media Services from the Developer menu in Settings."
      },
      {
        "name": "Run the Android matrix on two OS versions",
        "text": "Cue with the screen off on a build targeting API level 35, play music and a podcast, take a call, remove headphones, and set a language with no installed voice, on one device below Android 12 and one at 12 or later."
      },
      {
        "name": "Log the inputs to every cue",
        "text": "Record scheduled and actual time, focus or activation result, promptStyle on iOS, the output route, and app state including whether the foreground service was running."
      }
    ],
    "sources": [
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/mediaserviceswereresetnotification",
        "checked": "2026-10-03",
        "note": "Reset Media Services test utility"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/promptstyle-swift.enum/none",
        "checked": "2026-10-03",
        "note": "none style while Siri recognizes speech"
      },
      {
        "url": "https://developer.apple.com/documentation/avfaudio/avaudiosession/setprefersnointerruptionsfromsystemalerts(_:)",
        "checked": "2026-10-03",
        "note": "banner versus full-screen call styles"
      },
      {
        "url": "https://developer.android.com/media/optimize/audio-focus",
        "checked": "2026-10-03",
        "note": "Android 15 focus restriction; Android 12 system-managed focus; speech not ducked"
      },
      {
        "url": "https://developer.android.com/reference/android/speech/tts/TextToSpeech",
        "checked": "2026-10-03",
        "note": "language support codes"
      }
    ]
  }
];
