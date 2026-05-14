/**
 * Icon barrel — previously used react-icons/fa + fa6 + fc + fi (~944 KiB total).
 * Now re-exports lucide-react icons under the same names so every consumer
 * compiles without changes. Lucide is fully tree-shakeable (~2 KB per icon).
 *
 * Google brand icon is not in lucide — provided as a tiny inline SVG component.
 */
import React from 'react';
export {
  Search as FaSearch,
  User as FaUser,
  LogOut as FaSignOutAlt,
  PenLine as FaPenAlt,
  Home as FaHome,
  Calendar as FaCalendarAlt,
  Github as FaGithub,
  Facebook as FaFacebook,
  Youtube as FaYoutube,
  Lightbulb as FaRegLightbulb,
  Users as FaUsers,
  ShieldCheck as FaShieldAlt,
  Wand2 as FaMagic,
  ArrowLeft as FaArrowLeft,
  AlertTriangle as FaExclamationTriangle,
  ArrowUp as FaArrowUp,
  Twitter as FaTwitter,
  Twitter as FaXTwitter,
  Linkedin as FaLinkedin,
  Eye as FaEye,
  BookOpen as FaBookOpen,
  Clock as FaClock,
  HelpCircle as FaQuestionCircle,
  ArrowRight as FaArrowRight,
  Mail as FaEnvelope,
  ChevronDown as FaChevronDown,
  Bot as FaRobot,
  Brain as FaBrain,
  Code2 as FaCode,
  TrendingUp as FaChartLine,
  Heart as FaHeart,
  Book as FaBook,
  Loader2 as FiLoader,
} from 'lucide-react';

// ── Google brand icon (inline SVG, ~500 B, no extra package) ────────────────
export function FcGoogle({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
