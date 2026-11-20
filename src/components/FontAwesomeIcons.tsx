import { FontAwesomeIcon, type FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowLeft,
  faArrowRight,
  faBars,
  faBookOpen,
  faBookBible,
  faCalendarDays,
  faCircleCheck,
  faCirclePlay,
  faCross,
  faHandHoldingHeart,
  faHandsPraying,
  faPeopleGroup,
  faPlay,
  faUser,
  faBullseye,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChurch,
  faCircle,
  faClock,
  faComments,
  faCompass,
  faCopy,
  faEllipsis,
  faEnvelope,
  faGripLinesVertical,
  faHeart,
  faImage,
  faMagnifyingGlass,
  faMoon,
  faPaperPlane,
  faPhone,
  faSun,
  faTableColumns,
  faLocationDot,
  faUpload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faFacebookF, faWhatsapp, faYoutube } from "@fortawesome/free-brands-svg-icons";

type IconProps = Omit<FontAwesomeIconProps, "icon">;

const createIcon = (definition: IconDefinition, displayName: string) => {
  const Icon = ({ className, ...props }: IconProps) => (
    <FontAwesomeIcon icon={definition} className={className} {...props} />
  );
  Icon.displayName = displayName;
  return Icon;
};

export const ArrowLeft = createIcon(faArrowLeft, "ArrowLeft");
export const ArrowRight = createIcon(faArrowRight, "ArrowRight");
export const BookBible = createIcon(faBookBible, "BookBible");
export const CalendarDays = createIcon(faCalendarDays, "CalendarDays");
export const CircleCheck = createIcon(faCircleCheck, "CircleCheck");
export const CirclePlay = createIcon(faCirclePlay, "CirclePlay");
export const Cross = createIcon(faCross, "Cross");
export const HandHoldingHeart = createIcon(faHandHoldingHeart, "HandHoldingHeart");
export const HandsPraying = createIcon(faHandsPraying, "HandsPraying");
export const PeopleGroup = createIcon(faPeopleGroup, "PeopleGroup");
export const Play = createIcon(faPlay, "Play");
export const User = createIcon(faUser, "User");
export const Whatsapp = createIcon(faWhatsapp, "Whatsapp");
export const BookOpen = createIcon(faBookOpen, "BookOpen");
export const Check = createIcon(faCheck, "Check");
export const ChevronDown = createIcon(faChevronDown, "ChevronDown");
export const ChevronLeft = createIcon(faChevronLeft, "ChevronLeft");
export const ChevronRight = createIcon(faChevronRight, "ChevronRight");
export const ChevronUp = createIcon(faChevronUp, "ChevronUp");
export const Church = createIcon(faChurch, "Church");
export const Circle = createIcon(faCircle, "Circle");
export const Clock = createIcon(faClock, "Clock");
export const Copy = createIcon(faCopy, "Copy");
export const Dot = createIcon(faCircle, "Dot");
export const Facebook = createIcon(faFacebookF, "Facebook");
export const FacebookLogo = createIcon(faFacebook, "FacebookLogo");
export const GripVertical = createIcon(faGripLinesVertical, "GripVertical");
export const Heart = createIcon(faHeart, "Heart");
export const Image = createIcon(faImage, "Image");
export const Mail = createIcon(faEnvelope, "Mail");
export const MapPin = createIcon(faLocationDot, "MapPin");
export const Menu = createIcon(faBars, "Menu");
export const MessageCircle = createIcon(faComments, "MessageCircle");
export const Moon = createIcon(faMoon, "Moon");
export const MoreHorizontal = createIcon(faEllipsis, "MoreHorizontal");
export const Navigation = createIcon(faCompass, "Navigation");
export const PanelLeft = createIcon(faTableColumns, "PanelLeft");
export const Phone = createIcon(faPhone, "Phone");
export const Search = createIcon(faMagnifyingGlass, "Search");
export const Send = createIcon(faPaperPlane, "Send");
export const Sun = createIcon(faSun, "Sun");
export const Target = createIcon(faBullseye, "Target");
export const Upload = createIcon(faUpload, "Upload");
export const X = createIcon(faXmark, "X");
export const Youtube = createIcon(faYoutube, "Youtube");
export const YoutubeLogo = createIcon(faYoutube, "YoutubeLogo");
