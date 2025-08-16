# Flarum Tag Tiles Swiper

A Flarum extension that converts the default tag tiles layout into a modern swiper-based carousel with social media integration.

## Features

- **Tag Tiles Conversion**: Transforms standard tag tiles into an interactive swiper carousel
- **Advanced Swiper Configuration**: Full control over autoplay, loop mode, transition speed, and more
- **Background Image Support**: Integrates with flarum-tag-background extension for custom tag backgrounds
- **Social Media Integration**: Displays configurable social media buttons (Kick, Facebook, Twitter, YouTube, Instagram)
- **Mobile Responsive**: Optimized layout for mobile devices
- **Independent Operation**: Works standalone without dependencies on other custom extensions

### Advanced Swiper Features

- **Autoplay Control**: Enable/disable automatic slide progression with customizable delay
- **Loop Mode**: Infinite loop for continuous sliding experience
- **Free Mode**: Allow free sliding without snapping to slides
- **Grab Cursor**: Visual feedback with grab cursor on hover
- **Pause on Hover**: Automatically pause autoplay when mouse hovers over slides
- **Customizable Transitions**: Adjustable transition speed and spacing between slides

## Installation

```bash
composer require wusong8899/flarum-tag-tiles
```

## Configuration

1. Enable the extension in your Flarum admin panel
2. Configure social media links and icons in the extension settings
3. Adjust advanced swiper settings:
   - **Autoplay Settings**: Enable autoplay and set delay between slides
   - **Loop Mode**: Enable infinite loop for continuous sliding
   - **Transition Effects**: Customize transition speed and spacing
   - **Interactive Features**: Enable grab cursor, free mode, and hover pause
4. The extension will automatically convert tag tiles on the tags page

### Advanced Configuration Options

- **Minimum Slides for Loop**: Set minimum number of slides required for loop mode
- **Autoplay Delay**: Control time between automatic slide transitions (in milliseconds)
- **Transition Speed**: Adjust animation duration for slide transitions
- **Space Between Slides**: Customize spacing between individual slides
- **Pause on Mouse Enter**: Pause autoplay when hovering over the carousel
- **Grab Cursor**: Show grab cursor to indicate draggable content
- **Free Mode**: Allow free sliding without automatic slide snapping

## Requirements

- Flarum ^1.0
- flarum/tags extension

## License

MIT License
