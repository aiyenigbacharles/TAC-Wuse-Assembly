# Wuse Assembly Connect

## How to add photos to an album

Drop supported image files into `src/assets/gallery-source/choir-sessions/`, `prayer-sessions/`, `seminars/`, or `media/`. The image pipeline assigns each file to that album automatically; it keeps the original filename and reuses generated variants for identical image content. To place a top-level photo in an album, add its generated image id to `assignments` in `src/assets/gallery-source/groups.json`, or set a `group` in its `captions.json` entry. Assignments and caption groups override a folder's default. Unassigned top-level photos are listed as a warning and do not appear in an album. Set album covers with full-resolution originals in `src/assets/gallery-covers/`, then point each group's `coverSource` at its file in `groups.json`. Run `npm run images` (also run automatically before `npm run dev` and `npm run build`) to refresh the manifests and album counts.

## How to add new photos

Drop JPEG, PNG, WebP, AVIF, or HEIC originals into `src/assets/gallery-source/`, using a new filename such as `gallery-154.jpg`. The gallery and floating hero read from the generated manifest automatically. Run `npm run images` to regenerate optimized AVIF/WebP sizes and the manifest; `npm run dev` and `npm run build` also run the pipeline for you. To add a caption, accessible alt text, or feature a photo in the hero, edit `src/assets/gallery-source/captions.json` using the filename as its key. Duplicate image content shares its optimized files automatically.

# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Project Title

**The Apostolic Church, Wuse Assembly — Official Website**

---

## 1. Project Overview

The Apostolic Church, Wuse Assembly requires a simple, modern, and mobile-optimized website to establish a clear digital presence. The website will serve first-time visitors, church members, and online audiences by providing essential information about the church, showcasing activities, and enabling interaction through testimonies and donation information.

The website should prioritize clarity, speed, accessibility, and ease of use. It must remain simple to manage by non-technical administrators and avoid unnecessary complexity.

---

## 2. Project Objectives

* Establish an official online presence for the church
* Make it easy for visitors to find service times and location
* Showcase church services and activities through images
* Provide clear donation information
* Allow members to submit testimonies
* Introduce church leadership
* Ensure excellent mobile usability
* Maintain a welcoming and clean visual experience

---

## 3. Target Audience

* First-time visitors searching for the church online
* Church members seeking information or updates
* Online viewers interested in church activities
* Partners and donors

Primary usage is expected from mobile devices.

---

## 4. Core Features & Pages

### 4.1 Home Page

**Purpose:** Immediate introduction and navigation hub.

**Content:**

* Church name and logo
* Welcome message
* Service days and times
* Church address
* “Get Directions” button linking to Google Maps
* Quick access buttons:

  * Make a Donation
  * Share Testimony
  * View Gallery
* Brief introduction section
* Footer with contact details

---

### 4.2 About Page

**Content:**

* Short church history
* Mission and vision
* Brief description of beliefs
* Overview of church leadership

---

### 4.3 Pastors / Leadership Section

**Purpose:** Introduce church leadership and provide approved contact access.

**Requirements:**

* Display profiles for **four (4) pastors**
* Each profile includes:

  * Full name
  * Title or role
  * Profile photograph
  * Approved contact details (phone number and/or email)

**Layout:**

* Clean grid layout
* Two profiles per row on mobile
* Responsive layout on desktop

**Functional Requirements:**

* Tap-to-call functionality for phone numbers on mobile devices
* Easy updating of contact details by administrators

**Privacy Requirement:**

* Only publicly approved contact information should be displayed.

---

### 4.4 Gallery Page

**Purpose:** Showcase church services and events.

**Requirements:**

* Image grid layout
* Mobile-friendly display
* Tap to expand images
* Images grouped by service or event
* Optimized image loading for performance

---

### 4.5 Make a Donation Page

**Purpose:** Provide church account details for giving.

**Content:**

* Account name(s)
* Bank name(s)
* Account number(s)
* Donation categories (Tithe, Offering, Projects, etc.)
* Copy-to-clipboard functionality for account numbers
* Appreciation message

No online payment gateway required.

---

### 4.6 Share Testimonies Page

**Purpose:** Allow users to submit testimonies.

**Form Fields:**

* Name (optional)
* Contact information (optional)
* Testimony message
* Consent checkbox for publishing

Form submissions should be sent to a designated church email.

---

### 4.7 Contact Page

**Content:**

* Church address
* Phone number
* WhatsApp contact link
* Google Maps direction link
* Service times

---

## 5. Design Requirements

### Visual Style

* Clean, warm, and welcoming
* Minimalist layout
* Easy readability
* Large buttons for mobile interaction

### Branding

* Use church colors where available
* Neutral background tones preferred

---

## 6. Light & Dark Mode Requirements

* Website must support both Light Mode and Dark Mode
* Automatic detection based on device/system preference
* Manual toggle available in header or menu
* High readability and contrast in both modes
* Images and buttons must remain clear and visible
* User preference should persist during browsing session

---

## 7. Mobile Optimization Requirements

* Mobile-first design approach
* Fast loading pages
* Optimized images
* Large tap targets for buttons
* Clear font sizing
* Responsive across all screen sizes
* Minimal navigation friction

---

## 8. Performance Requirements

* Fast load time on mobile networks
* Compressed images
* Lightweight transitions only if necessary
* No auto-playing media

---

## 9. Content Management Requirements

* Easy updating of:

  * Gallery images
  * Service times
  * Donation details
  * Pastor profiles
* Non-technical users should be able to manage updates easily.

---

## 10. Success Criteria

The website is considered successful if:

* Visitors can find service time and location within 10 seconds
* Users can open directions easily from mobile devices
* Donation information is clearly accessible
* Testimonies can be submitted without difficulty
* Leadership information is clear and accessible
* Pages load quickly on mobile networks


## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Gallery photos

To add more floating/gallery images, drop files into src/assets/gallery/: they appear automatically in the home hero and the gallery.

