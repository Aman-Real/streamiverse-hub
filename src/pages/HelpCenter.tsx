import { HelpCircle, MessageCircle, BookOpen, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How do I reset my password?", a: "Go to Settings > Account > Change Password. You'll receive a reset link via email." },
  { q: "Can I download videos for offline viewing?", a: "Yes, Premium subscribers can download up to 25 titles for offline viewing on mobile devices." },
  { q: "How do I cancel my subscription?", a: "Navigate to Settings > Subscription > Cancel Plan. Your access continues until the billing period ends." },
  { q: "Why is my video buffering?", a: "Check your internet connection. You can also lower the video quality in Settings > Playback > HD Streaming." },
  { q: "How many devices can I use simultaneously?", a: "The Premium plan allows streaming on up to 4 devices at once." },
];

const HelpCenter = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onSearch={setSearch} />
      <div className="pt-24 px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-8"><HelpCircle className="w-8 h-8" /> Help Center</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: MessageCircle, label: "Live Chat", desc: "Chat with support" },
            { icon: Mail, label: "Email Us", desc: "support@streamix.app" },
            { icon: BookOpen, label: "Guides", desc: "Browse tutorials" },
          ].map(item => (
            <div key={item.label} className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-lg px-4">
              <AccordionTrigger className="text-sm">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default HelpCenter;
