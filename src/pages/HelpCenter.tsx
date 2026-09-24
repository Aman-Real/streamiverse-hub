import { BookOpen, HelpCircle, Mail, MessageCircle } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { APP_CONFIG } from "@/config/app.config";

const SUPPORT_CHANNELS = [
  { icon: MessageCircle, label: "Live Chat", desc: "Chat with support" },
  { icon: Mail, label: "Email Us", desc: APP_CONFIG.supportEmail },
  { icon: BookOpen, label: "Guides", desc: "Browse tutorials" },
];

const FAQS = [
  { question: "How do I reset my password?", answer: "Go to Settings > Account > Change Password. You'll receive a reset link via email." },
  { question: "Can I download videos for offline viewing?", answer: "Yes, Premium subscribers can download up to 25 titles for offline viewing on mobile devices." },
  { question: "How do I cancel my subscription?", answer: "Navigate to Settings > Subscription > Cancel Plan. Your access continues until the billing period ends." },
  { question: "Why is my video buffering?", answer: "Check your internet connection. You can also lower the video quality in Settings > Playback > HD Streaming." },
  { question: "How many devices can I use simultaneously?", answer: "The Premium plan allows streaming on up to 4 devices at once." },
];

const HelpCenter = () => (
  <PageShell className="text-foreground">
    <div className="pt-24 px-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold flex items-center gap-3 mb-8"><HelpCircle className="w-8 h-8" /> Help Center</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {SUPPORT_CHANNELS.map(channel => (
          <div key={channel.label} className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <channel.icon className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">{channel.label}</p>
            <p className="text-xs text-muted-foreground">{channel.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {FAQS.map((faq, index) => (
          <AccordionItem key={faq.question} value={`faq-${index}`} className="bg-card border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </PageShell>
);

export default HelpCenter;
