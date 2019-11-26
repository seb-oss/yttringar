# utterances 🔮

A lightweight comments widget built on GitHub issues. Use GitHub issues for blog comments, wiki pages and more!

- [Open source](https://github.com/utterance). 🙌
- No tracking, no ads, always free. 📡🚫
- No lock-in. All data stored in GitHub issues. 🔓
- Styled with [Primer](http://primer.style), the css toolkit that powers GitHub. 💅
- Dark theme. 🌘
- Lightweight. Vanilla TypeScript. No font downloads, JavaScript frameworks or polyfills for evergreen browsers. 🐦🌲

## how it works

When Utterances loads, the GitHub [issue search API](https://developer.github.com/v3/search/#search-issues) is used to find the issue associated with the page based on `url`, `pathname` or `title`. If we cannot find an issue that matches the page, no problem, [utterances-bot](https://github.com/utterances-bot) will automatically create an issue the first time someone comments.

To comment, users must authorize the utterances app to post on their behalf using the GitHub [OAuth flow](https://developer.github.com/v3/oauth/#web-application-flow). Alternatively, users can comment on the GitHub issue directly.

## Getting started

First make sure you create a file in **src** called config.ts. In src/config.ts insert the following strings:

```
export const settings = {
  UTTERANCES_API: the oauth api for producing github tokens.
  GITHUB_API: github's REST-api, if running externally use https://api.github.com/
  GITHUB_REPO_URL: The url for the repo where the user should be linked to. TODO: take this value from front end instantiation
}
```

<!-- TODO: create default config values -->

## sites using utterances

- Haxe [documentation](https://haxe.org/manual) and [cookbook](https://code.haxe.org/)
- [danyow.net](https://danyow.net)
- [os.phil-opp.com](https://os.phil-opp.com/second-edition)
- **[and many more...](https://github.com/utterance/utterances/blob/master/SITES.md#sites-using-utterances)**

Are you using utterances? [Add your site](https://github.com/utterance/utterances/edit/master/SITES.md) to the list!

# try it out 👇👇👇
