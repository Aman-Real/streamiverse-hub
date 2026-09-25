import { HelpCircle, Mail, Settings, User, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import PageHeader from "@/components/common/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { APP_CONFIG } from "@/config/app.config";

interface SupportChannel {
  icon: LucideIcon;
  label: string;
  desc: string;
  /** In-app route, or an external href such as mailto:. */
  to: string;
}

const SUPPORT_CHANNELS: SupportChannel[] = [
  { icon: Mail, label: "Email us", desc: APP_CONFIG.supportEmail, to: `mailto:${APP_CONFIG.supportEmail}` },
  { icon: User, label: "Your profile", desc: "Name, photo and plan", to: ROUTES.profile },
  { icon: Settings, label: "Playback settings", desc: "Autoplay and HD quality", to: ROUTES.settings },
];

const FAQS = [
  {
    question: "How do I reset my password?",
    answer: "Sign out, then on the sign-in screen choose \"Forgot password?\" and enter your email. We'll send you a link to set a new one.",
  },
  {
    question: "How do I save a title to watch later?",
    answer: "Tap Save on any movie or series. Saved titles appear in your Watchlist in My Lounge, on every device you sign in on.",
  },
  {
    question: "What does the Watch Room button do?",
    answer:
      "It picks up where you left off. If you finished an episode, it starts the next one; if you finished a movie or a whole series, it suggests similar titles. New here? It shows the latest movies, web series, anime and TV shows.",
  },
  {
    question: "How do I stop the next episode from playing automatically?",
    answer: "Go to Settings > Playback and turn off \"Autoplay next episode\". You'll still get an \"Up next\" card to start it yourself.",
  },
  {
    question: "Why is my video buffering?",
    answer: "Check your internet connection. You can also turn off HD Streaming in Settings > Playback to play in 720p instead of 1080p.",
  },
  {
    question: "How do I change my name or profile photo?",
    answer: "Open My Profile from the account menu. Use the edit button next to Display Name, and Upload next to Profile Picture.",
  },
  {
    question: "How do I clear my watch history?",
    answer: "Open Watch History from the account menu. Remove single titles with the X, or everything with Clear All.",
  },
];

const CHANNEL_CLASS =
  "block rounded-2xl border bg-card p-4 text-center transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const HelpCenter = () => (
  <PageShell className="text-foreground" withFooter>
    <div className="page-container-narrow">
      <PageHeader title="Help Center" icon={HelpCircle} description="Answers to common questions, and how to reach us." />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {SUPPORT_CHANNELS.map(channel => {
          const content = (
            <>
              <channel.icon className="mx-auto mb-2 h-7 w-7 text-primary" aria-hidden />
              <p className="text-sm font-medium">{channel.label}</p>
              <p className="truncate text-xs text-muted-foreground">{channel.desc}</p>
            </>
          );
          return channel.to.startsWith("/") ? (
            <Link key={channel.label} to={channel.to} className={CHANNEL_CLASS}>{content}</Link>
          ) : (
            <a key={channel.label} href={channel.to} className={CHANNEL_CLASS}>{content}</a>
          );
        })}
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {FAQS.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`} className="rounded-2xl border bg-card px-4">
              <AccordionTrigger className="text-left text-sm">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  </PageShell>
);

export default HelpCenter;
