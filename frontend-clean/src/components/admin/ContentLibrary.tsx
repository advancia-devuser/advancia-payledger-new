"use client";

import React, { useState } from "react";
import {
  Mail,
  MessageSquare,
  FileText,
  Globe,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

const ContentLibrary = () => {
  const [selectedType, setSelectedType] = useState("emails");
  const [selectedCategory, setSelectedCategory] = useState("welcome");
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const contentLibrary = {
    emails: {
      name: "Email Templates",
      icon: Mail,
      color: "blue",
      categories: {
        welcome: {
          name: "Welcome Series",
          items: [
            {
              id: "welcome-1",
              title: "Welcome Email - Day 1",
              subject: "Welcome to Advancia Pay! Here's what to do first",
              content: `Hi [Name],

Welcome to Advancia Pay! We're excited to have you here.

Your account is set up and ready to go. Here's what you can do right now:

**Get Started in 3 Steps:**

1. Complete your profile - Add your basic info and set up 2FA (takes 2 minutes)
2. Connect your wallet - We support MetaMask, WalletConnect, and 15+ other providers
3. Make your first transaction - Send, receive, or convert crypto across 5 blockchain networks

Need help? Our support team is here 24/7 at support@advancia.com.

Best,
The Advancia Team

P.S. Your first transaction has zero fees - our welcome gift to you!`,
              notes:
                "Sent immediately after signup. Focus: Quick wins and immediate value.",
            },
            {
              id: "welcome-2",
              title: "Welcome Email - Day 3",
              subject: "3 Advancia features you might have missed",
              content: `Hi [Name],

You've been exploring Advancia Pay for a few days now. Here are some features that new users love but often overlook:

**1. Multi-Network Swaps**
Convert ETH to MATIC to BNB - all without leaving the app. We handle the bridging automatically.

**2. Scheduled Payments**
Set up recurring crypto payments for subscriptions, payroll, or regular transfers. Set it once, forget it.

**3. Healthcare Appointments**
Book appointments at 127+ partner facilities and pay with crypto or traditional methods - all in one place.

Want to dive deeper? Check out our video tutorials: [link]

Questions? Just reply to this email.

Best,
The Advancia Team`,
              notes:
                "Sent 3 days after signup. Focus: Feature discovery and engagement.",
            },
          ],
        },
        transaction: {
          name: "Transaction Updates",
          items: [
            {
              id: "tx-received",
              title: "Payment Received",
              subject: "Payment received: [Amount] [Currency]",
              content: `Hi [Name],

Good news! Your payment has been received and confirmed.

**Transaction Details:**
Amount: [Amount] [Currency] (≈ $[USD_Value])
From: [Sender_Address]
Network: [Network_Name]
Transaction ID: [TX_Hash]
Confirmed: [Timestamp]

Your updated balance: $[Balance]

View full details in your dashboard: [Link]

Need help? Contact support@advancia.com

Best,
Advancia Pay`,
              notes:
                "Sent immediately when payment is confirmed. Focus: Confirmation and reassurance.",
            },
            {
              id: "tx-pending",
              title: "Withdrawal Pending",
              subject: "Your withdrawal is being processed",
              content: `Hi [Name],

We're processing your withdrawal request.

**Withdrawal Details:**
Amount: [Amount] [Currency]
Destination: [Wallet_Address]
Network: [Network_Name]
Estimated arrival: [Time_Estimate]

**What's happening now:**
Your withdrawal is in the queue and will be processed within the next [Time]. We'll send you another email the moment it's complete.

Track your withdrawal: [Link]

Questions? We're here to help: support@advancia.com

Best,
Advancia Pay`,
              notes:
                "Sent when withdrawal is initiated. Focus: Transparency and timeline.",
            },
          ],
        },
        healthcare: {
          name: "Healthcare",
          items: [
            {
              id: "appt-confirm",
              title: "Appointment Confirmation",
              subject: "Your appointment is confirmed - [Date] at [Time]",
              content: `Hi [Name],

Your appointment is all set!

**Appointment Details:**
Date: [Date]
Time: [Time]
Provider: [Provider_Name]
Location: [Facility_Name], [Address]
Type: [Appointment_Type]

**Before Your Visit:**
• Bring your insurance card and ID
• Arrive 15 minutes early for check-in
• Bring any recent test results or medication lists

Need to reschedule? Click here: [Link]

Questions? Contact [Facility_Name] at [Phone]

See you soon,
Advancia Health Network`,
              notes:
                "Sent immediately after booking. Focus: Essential details and preparation.",
            },
            {
              id: "appt-reminder",
              title: "Appointment Reminder",
              subject: "Reminder: Your appointment is tomorrow at [Time]",
              content: `Hi [Name],

This is a friendly reminder about your upcoming appointment.

**Tomorrow:**
[Day], [Date] at [Time]
[Provider_Name]
[Facility_Name]

**What to bring:**
✓ Insurance card and ID
✓ Payment method (we accept crypto!)
✓ Any medications or supplements you're taking

Need directions? [Link to map]
Need to reschedule? [Link]

We look forward to seeing you!

Advancia Health Network`,
              notes:
                "Sent 24 hours before appointment. Focus: Reminder and preparation.",
            },
          ],
        },
        support: {
          name: "Customer Support",
          items: [
            {
              id: "support-received",
              title: "Support Request Received",
              subject: "We received your request - here's what's next",
              content: `Hi [Name],

Thanks for reaching out. We've received your request and a team member will respond within [Time_Frame].

**Your Request:**
Ticket ID: [Ticket_ID]
Subject: [Subject]
Created: [Timestamp]

**In the meantime:**
• Check our Help Center for instant answers: [Link]
• Join our community forum where users help each other: [Link]
• Follow your ticket status: [Link]

We're on it!

Best,
[Agent_Name]
Advancia Support Team`,
              notes:
                "Auto-sent when ticket is created. Focus: Acknowledgment and self-service options.",
            },
            {
              id: "support-resolved",
              title: "Issue Resolved",
              subject: "Your issue has been resolved",
              content: `Hi [Name],

Great news - we've resolved your issue!

**What we did:**
[Resolution_Summary]

Your account should be working normally now. If you're still experiencing any problems, just reply to this email and we'll take another look.

**Was this helpful?**
[Rate us: 👍 👎]

Thanks for your patience!

Best,
[Agent_Name]
Advancia Support Team`,
              notes:
                "Sent when ticket is closed. Focus: Resolution summary and feedback.",
            },
          ],
        },
      },
    },
    social: {
      name: "Social Media Posts",
      icon: MessageSquare,
      color: "purple",
      categories: {
        product: {
          name: "Product Announcements",
          items: [
            {
              id: "social-feature",
              title: "New Feature Launch",
              content: `🚀 NEW: Multi-chain swaps are here!

Convert between ETH, MATIC, BNB, ARB, and OP without leaving Advancia Pay. 

We handle the bridging automatically. You handle the coffee break. ☕

Try it now →

#crypto #DeFi #blockchain`,
              notes:
                "Platform: Twitter/X. Tone: Exciting but accessible. CTA: Clear and immediate.",
            },
            {
              id: "social-milestone",
              title: "Milestone Announcement",
              content: `🎉 10,000 active wallets milestone!

Thank you to everyone who's made Advancia Pay their go-to platform for crypto payments and healthcare management.

This is just the beginning. Here's what's coming next: 🧵

1/ Stellar (XLM) network support
2/ Fiat on-ramp integrations
3/ Mobile app launch

Stay tuned! 🚀`,
              notes:
                "Platform: Twitter/X (thread starter). Tone: Grateful, forward-looking.",
            },
            {
              id: "social-education",
              title: "Educational Content",
              content: `💡 Quick Guide: Gas Fees Explained

Gas fees = the cost to process your transaction on the blockchain.

Think of it like shipping costs for sending a package. The faster you want it, the more you pay.

🎯 Pro tip: Use our gas tracker to time your transactions when fees are lowest (usually weekends).

Questions? Drop them below 👇`,
              notes:
                "Platform: Twitter/X or LinkedIn. Tone: Educational, helpful. Encourages engagement.",
            },
          ],
        },
        engagement: {
          name: "Community Engagement",
          items: [
            {
              id: "social-question",
              title: "Engagement Post",
              content: `Question for our community:

What's the biggest barrier keeping you from using crypto for everyday payments?

A) Too complicated
B) Too volatile
C) Not enough places accept it
D) Security concerns

Let us know - we're listening. 👂`,
              notes:
                "Platform: All platforms. Tone: Conversational, curious. Purpose: Gather insights.",
            },
            {
              id: "social-ugc",
              title: "User-Generated Content",
              content: `📸 Community Spotlight

"I paid for my dental checkup with crypto today. The future is here!" - @[Username]

Stories like this are why we built Advancia Pay. Making digital payments work for real life. 💙

Share your Advancia story and tag us for a chance to be featured!

#AdvanciaStories`,
              notes:
                "Platform: Instagram/Twitter. Tone: Celebratory, community-focused.",
            },
            {
              id: "social-tip",
              title: "Quick Tips",
              content: `💰 Advancia Tip of the Week:

Enable price alerts to get notified when your crypto hits your target price. Perfect for timing your conversions.

Settings → Notifications → Price Alerts

What other features do you want tips on? Comment below! 👇`,
              notes:
                "Platform: All platforms. Tone: Helpful, actionable. Series format.",
            },
          ],
        },
        healthcare: {
          name: "Healthcare Focus",
          items: [
            {
              id: "social-healthcare-1",
              title: "Healthcare + Crypto Value Prop",
              content: `🏥 Healthcare meets crypto.

127 medical facilities now accept crypto payments through Advancia Pay.

• Book appointments
• Pay with ETH, BNB, MATIC, or USD
• Manage your medical records
• All in one secure platform

Healthcare payments, simplified. Learn more →

#digitalhealth #crypto #healthcare`,
              notes:
                "Platform: LinkedIn/Twitter. Tone: Professional, benefit-focused.",
            },
            {
              id: "social-healthcare-2",
              title: "Provider Success Story",
              content: `📊 Case Study: Riverside Medical Center

After integrating Advancia Pay:
• 40% faster payment processing
• 15% increase in international patients
• Zero payment fraud incidents

"Our patients love having payment options. Whether they're paying with insurance, card, or crypto - we've got them covered." - Dr. Sarah Chen, Practice Manager

Healthcare providers: Join our network →`,
              notes:
                "Platform: LinkedIn. Tone: Data-driven, credible, B2B focused.",
            },
          ],
        },
      },
    },
    landing: {
      name: "Landing Page Copy",
      icon: Globe,
      color: "green",
      categories: {
        homepage: {
          name: "Homepage Sections",
          items: [
            {
              id: "hero-1",
              title: "Hero Section - Primary",
              content: `**Headline:**
Your Digital Wallet. Your Healthcare Hub. One Platform.

**Subheadline:**
Send, receive, and manage crypto across 5+ blockchain networks. Book healthcare appointments. All from one secure platform trusted by 10,000+ users.

**CTA Primary:** Get Started Free
**CTA Secondary:** See How It Works

**Trust Indicators:**
✓ $4.2M+ in monthly transactions
✓ 127 healthcare partners
✓ Bank-level security`,
              notes:
                "Above the fold. Focus: Clear value proposition, social proof, dual CTAs.",
            },
            {
              id: "features",
              title: "Features Section",
              content: `**Headline:**
Everything you need in one place

**Multi-Chain Wallet**
Send, receive, and swap crypto across Ethereum, Polygon, BSC, Arbitrum, and Optimism. Your assets, unified.

**Healthcare Network**
Book appointments at 127+ partner facilities. Pay with crypto or traditional methods. Manage medical records securely.

**Instant Swaps**
Convert between networks automatically. No manual bridging. No complicated steps. Just instant swaps.

**Bank-Grade Security**
256-bit encryption, 2FA, and cold storage. Your assets are protected by the same security banks use.

**24/7 Support**
Real humans, real help. Our support team is available around the clock to help you with anything.

**Multi-Currency**
Work in your preferred currency: USD, EUR, GBP, JPY, CAD, AUD. Automatic conversion included.`,
              notes:
                "Mid-page. Focus: Feature benefits, not just features. Use clear, simple language.",
            },
            {
              id: "social-proof",
              title: "Social Proof Section",
              content: `**Headline:**
Trusted by thousands of users worldwide

**Testimonial 1:**
"Finally, a crypto wallet that doesn't feel like work. I can manage everything in one place - payments, conversions, even my doctor appointments."
— Alex M., Software Engineer

**Testimonial 2:**
"We've processed over $500K through Advancia Pay with zero issues. The multi-chain support saves us hours every week."
— Jordan L., Finance Director

**Testimonial 3:**
"As a healthcare provider, accepting crypto payments seemed complicated. Advancia made it simple. Our international patients love it."
— Dr. Sarah Chen, Practice Manager

**Stats Bar:**
10,000+ Active Users | $4.2M Monthly Volume | 127 Healthcare Partners | 99.9% Uptime`,
              notes:
                "Mid-page. Focus: Real users, specific benefits, diverse use cases.",
            },
            {
              id: "cta-final",
              title: "Final CTA Section",
              content: `**Headline:**
Ready to simplify your digital life?

**Subheadline:**
Join 10,000+ users who trust Advancia Pay for their crypto and healthcare needs. No credit card required to start.

**CTA Primary:** Create Free Account
**CTA Secondary:** Schedule a Demo

**Trust Line:**
Your data is encrypted and never shared. View our security practices →`,
              notes:
                "Bottom of page. Focus: Low-friction signup, security reassurance.",
            },
          ],
        },
        healthcare: {
          name: "Healthcare Provider Pages",
          items: [
            {
              id: "provider-hero",
              title: "Healthcare Provider Landing - Hero",
              content: `**Headline:**
The Modern Payment Platform for Healthcare Providers

**Subheadline:**
Accept crypto and traditional payments. Manage bed occupancy. Automate scheduling. All while staying HIPAA-compliant.

**CTA Primary:** Request Demo
**CTA Secondary:** View Pricing

**Trust Indicators:**
✓ HIPAA Compliant
✓ 127 facilities already using us
✓ Average 40% faster payment processing`,
              notes:
                "Healthcare provider-specific landing page. Focus: Compliance, efficiency, credibility.",
            },
            {
              id: "provider-benefits",
              title: "Healthcare Provider Benefits",
              content: `**Headline:**
Everything your practice needs

**Faster Payments**
Accept crypto payments from international patients. Funds settle in minutes, not days. No currency exchange headaches.

**Real-Time Bed Management**
Track occupancy across ICU, General, Private, ER, Pediatric, and Maternity beds. Update status instantly. Zero communication gaps.

**Automated Scheduling**
Let patients book online. Automatic confirmations and reminders. Reduce no-shows by up to 30%.

**Complete Compliance**
HIPAA-compliant data handling. Automatic audit logs. Two-factor authentication for all staff. SOC 2 Type II certified.

**Revenue Insights**
Track payments, appointment revenue, and bed utilization. Export reports for accounting. Make data-driven decisions.`,
              notes:
                "Benefits section. Focus: Time savings, compliance, revenue optimization.",
            },
          ],
        },
        developers: {
          name: "Developer Pages",
          items: [
            {
              id: "dev-hero",
              title: "Developer Landing - Hero",
              content: `**Headline:**
Production-Ready Crypto Infrastructure

**Subheadline:**
Build payment experiences on Ethereum, Polygon, BSC, Arbitrum, and Optimism with a single API. Full sandbox environment included.

**CTA Primary:** Read the Docs
**CTA Secondary:** Get API Keys

**Code Preview:**
\`\`\`typescript
const payment = await advancia.payments.create({
  amount: 100,
  currency: 'USDC',
  network: 'polygon'
});
\`\`\``,
              notes:
                "Developer-focused landing. Focus: Technical capabilities, ease of integration, code-first.",
            },
            {
              id: "dev-features",
              title: "Developer Features",
              content: `**Headline:**
Built for developers who ship fast

**Multi-Chain SDK**
One SDK, five networks. JavaScript, Python, and Go support. TypeScript definitions included.

**WebSocket Subscriptions**
Real-time transaction updates. Listen for payments, confirmations, and failures. No polling required.

**Comprehensive Webhooks**
Get notified about every event. Automatic retry with exponential backoff. Signature verification included.

**Full Sandbox**
Test with real blockchain transactions. Free testnet tokens. Mirror production exactly.

**99.9% Uptime**
Monitored 24/7. Multi-region redundancy. Automatic failover. Status page at status.advancia.com

**Developer Support**
Dedicated Discord channel. Real engineers, real answers. Response time: < 2 hours.`,
              notes:
                "Developer benefits. Focus: DX, reliability, support quality.",
            },
          ],
        },
      },
    },
    templates: {
      name: "Reusable Templates",
      icon: FileText,
      color: "orange",
      categories: {
        fillable: {
          name: "Fill-in-the-Blank Templates",
          items: [
            {
              id: "template-launch",
              title: "Product Launch Announcement",
              content: `**Subject:** [Feature Name] is here! [Brief benefit]

Hi [Name],

We're excited to announce [Feature Name] - [one-sentence description of what it does].

**Why we built this:**
[2-3 sentences explaining the problem this solves and how it makes users' lives easier]

**How it works:**
1. [Step one - be specific]
2. [Step two - be specific]
3. [Step three - be specific]

**Get started:**
[Clear CTA with link]

[Optional: Include a visual, GIF, or screenshot]

**What's coming next:**
[Brief mention of what's on the roadmap to build excitement]

Questions? Hit reply or visit [support link].

Best,
[Your name]
The Advancia Team

P.S. [Optional: Extra tip, beta feature mention, or special offer]`,
              notes:
                "Use for: New features, integrations, network additions. Keep it under 250 words.",
            },
            {
              id: "template-incident",
              title: "Service Incident Communication",
              content: `**Subject:** [Platform Name] - [Brief status description]

Hi [Name],

**Current Status:** [ONE WORD: Investigating / Identified / Monitoring / Resolved]

**What's happening:**
[2-3 sentences maximum. Be specific about what's affected and what's not.]

**Impact:**
• [What users can't do]
• [What users can still do]

**What we're doing:**
[Brief explanation of your response - no technical jargon]

**Timeline:**
[Expected resolution time if you have one, or "We'll send another update within [timeframe]"]

**Need immediate help?**
[Alternative solution or workaround if available]

We'll keep you updated every [timeframe] until this is resolved.

Sorry for the disruption,
[Name]
Advancia Support Team

**Updates:**
[Timestamp] - [Update text]
[Timestamp] - [Update text]`,
              notes:
                "Use for: Outages, performance issues, security incidents. Update frequently, be transparent.",
            },
            {
              id: "template-survey",
              title: "User Feedback Request",
              content: `**Subject:** Quick question about your [Feature/Product] experience

Hi [Name],

I noticed you've been using [Feature Name] for [time period] now. How's it going?

**We'd love to know:**
[Single specific question - keep it simple]

[Multiple choice options OR open text field]

**Why we're asking:**
[Brief explanation of how you'll use this feedback]

Takes 30 seconds: [Survey Link]

Thanks for helping us improve!

Best,
[Name]
[Title], Advancia

P.S. [Optional: Incentive like "Everyone who responds gets early access to..." or "We'll share results with everyone"]`,
              notes:
                "Use for: Feature feedback, NPS surveys, user research. One question only for best response rates.",
            },
            {
              id: "template-milestone",
              title: "User Milestone Celebration",
              content: `**Subject:** [Milestone Achievement] 🎉

Hi [Name],

[Enthusiastic opener related to the milestone]!

**Your Stats:**
• [Metric 1]: [Number]
• [Metric 2]: [Number]
• [Metric 3]: [Number]

[2-3 sentences reflecting on their journey or impact]

**What's next?**
[Suggest a next action or feature they might not have tried yet]

Keep going - we're excited to see what you do next!

Best,
The Advancia Team

P.S. [Optional: Special reward, feature unlock, or exclusive content]`,
              notes:
                "Use for: First transaction, account anniversaries, volume milestones. Make it feel personal.",
            },
          ],
        },
        frameworks: {
          name: "Writing Frameworks",
          items: [
            {
              id: "framework-pain-solution",
              title: "Pain-Agitate-Solution Framework",
              content: `**Use this when:** Introducing a feature that solves a specific problem

**Structure:**

**1. Pain (Problem)**
Start with the frustration: "Sending crypto across different networks is a headache."

**2. Agitate (Make it worse)**
Remind them why it matters: "You have to use multiple bridges, pay fees twice, and wait 30+ minutes for confirmations. One wrong address and your funds are gone forever."

**3. Solution (Your product)**
Present the relief: "Advancia Pay handles multi-chain swaps automatically. One click, one interface, one fee. Your crypto moves across networks while you move on with your day."

**4. Proof (Why it works)**
Show evidence: "We've processed 50,000+ cross-chain swaps with a 99.99% success rate."

**5. Call-to-Action**
Make it easy: "Try your first swap now - no fees on your first transaction."

**Example in action:**
[Pain] Tired of juggling five different wallets for five different networks?
[Agitate] Every transfer means switching apps, manually bridging, and hoping you got the address right.
[Solution] Advancia Pay unifies everything. One wallet, all your networks, automatic bridging.
[Proof] 10,000+ users already simplified their crypto life.
[CTA] Get started in under 2 minutes →`,
              notes:
                "Best for: Product marketing, feature announcements, conversion-focused content.",
            },
            {
              id: "framework-feature",
              title: "Feature-Advantage-Benefit Framework",
              content: `**Use this when:** Explaining what your product does and why it matters

**Structure:**

**Feature:** What it is (the facts)
"Advancia Pay supports five blockchain networks: Ethereum, Polygon, BSC, Arbitrum, and Optimism."

**Advantage:** What it enables (the capability)
"This means you can send and receive crypto on any of these networks without managing separate wallets or addresses."

**Benefit:** What it means for them (the outcome)
"You save time, reduce errors, and never miss a payment because someone sent to the 'wrong' network."

**Formula:**
[Feature] → [Advantage] → [Benefit]

**Examples:**

1. **Real-time bed management** → Track occupancy updates instantly → Make faster admission decisions and never overbook

2. **Automatic crypto-to-USD conversion** → Withdrawals are calculated at current market rates → You always know exactly how much you're getting

3. **WebSocket transaction monitoring** → Get notified the second a payment arrives → Respond to customers faster and close deals sooner

**When to use each element:**
• Feature only: Technical documentation, specs
• Feature + Advantage: Product descriptions
• Feature + Advantage + Benefit: Marketing copy, sales`,
              notes:
                "Best for: Feature descriptions, product pages, sales conversations.",
            },
            {
              id: "framework-support",
              title: "Acknowledge-Explain-Solve-Verify Framework",
              content: `**Use this when:** Responding to support requests or complaints

**Structure:**

**1. Acknowledge**
Show you understand: "I can see your withdrawal has been pending for 45 minutes - I know that's frustrating."
→ Validates their concern
→ Shows empathy
→ Builds trust

**2. Explain**
Give context without excuses: "Ethereum network congestion is higher than usual today, which is slowing down all transactions network-wide."
→ Educates the user
→ Shows it's not just them
→ Explains without blaming

**3. Solve**
Provide the resolution: "I've escalated your transaction to priority processing. You should see it complete within the next 15 minutes."
→ Clear action taken
→ Specific timeline
→ Shows you're on it

**4. Verify**
Confirm and prevent: "I'll personally monitor this and email you the moment it's complete. I've also added you to our priority list for future transactions during high-traffic periods."
→ Follow-up commitment
→ Extra service
→ Prevents recurrence

**Full Example:**

"I can see your withdrawal has been pending for 45 minutes - I know that's frustrating when you need the funds now.

The Ethereum network is experiencing higher congestion than usual today (you can see current network status here: [link]), which is slowing down all transactions network-wide, not just ours.

I've escalated your transaction to priority processing and increased the gas fee to speed it up. You should see it complete within the next 15 minutes.

I'll personally monitor this and email you the moment it's complete. In the future, you can check our network status page before withdrawing to see if delays are expected, or use a faster network like Polygon for urgent transfers."`,
              notes:
                "Best for: Customer support, complaint resolution, incident communication.",
            },
          ],
        },
        scenarios: {
          name: "Common Scenarios",
          items: [
            {
              id: "scenario-onboarding",
              title: "User Onboarding Flow",
              content: `**Email 1: Welcome (Day 0 - Immediate)**
Goal: Confirm signup, set expectations, guide first action
Key elements: Welcome, verify email, first 3 steps, support info

**Email 2: Quick Start Guide (Day 1)**
Goal: Help them complete setup
Key elements: Video tutorial, common questions, setup checklist

**Email 3: Feature Discovery (Day 3)**
Goal: Showcase key features they might miss
Key elements: 3-5 features with benefits, use case examples

**Email 4: Success Stories (Day 7)**
Goal: Build confidence through social proof
Key elements: User testimonials, use cases similar to theirs

**Email 5: Upgrade Prompt (Day 14)**
Goal: Convert to paid or increase engagement
Key elements: Compare what they've done vs. what's possible, clear CTA

**Push Notification/In-App Messages:**
• First transaction: "🎉 First transaction complete! Here's what to try next..."
• Idle for 3 days: "Miss anything? Here's what's new since your last visit"
• Feature not used: "Quick tip: Did you know you can [feature]?"

**SMS (if opted in):**
• Transaction confirmations
• Security alerts
• Appointment reminders`,
              notes:
                "Timing is critical. Space out emails. Use behavior triggers where possible.",
            },
            {
              id: "scenario-crisis",
              title: "Crisis Communication Playbook",
              content: `**Severity 1: Critical Outage (Platform Down)**

**First 15 minutes:**
• Status page update: "Investigating"
• Twitter/X post: "We're aware of [issue] and investigating. Updates every 15 min."
• Email (if > 30 min): Brief acknowledgment, ETA for next update

**Every 15 minutes until resolved:**
• Update status page
• Update social media
• If > 1 hour: Email update with workaround if available

**Resolution:**
• Announce on all channels immediately
• Post-mortem within 24 hours
• Follow-up email with explanation and prevention plan

**Severity 2: Partial Outage (Some Features Down)**

**First 30 minutes:**
• Status page update
• Twitter/X post
• Email only if affecting > 25% of users

**Every 30 minutes:**
• Status updates
• Workarounds if available

**Severity 3: Degraded Performance**

**First hour:**
• Status page only
• Monitor for escalation

**Key Principles:**
• Be first to tell them
• Be transparent about impact
• Give specific timelines (or say you don't have one)
• Never minimize
• Own the problem
• Explain prevention plan

**Templates:**
[Use the Service Incident template above, adjusted for severity]`,
              notes:
                "Have this plan ready before you need it. Know who has access to each channel.",
            },
            {
              id: "scenario-churn",
              title: "Churn Prevention / Win-Back",
              content: `**Stage 1: At-Risk (No activity for 7 days)**

**Push notification/Email:**
"Miss anything? We've added [new feature] since your last visit. [CTA]"

Tone: Friendly check-in, value-add
Goal: Re-engage before they mentally check out

**Stage 2: Inactive (No activity for 30 days)**

**Email:**
"We noticed you haven't been around lately. Is everything okay? Hit reply and let us know if there's anything we can help with."

Tone: Concerned, personal, genuinely asking
Goal: Get feedback, show you care
Include: Quick survey link ("Why did you stop using Advancia?")

**Stage 3: Canceled/Closed Account**

**Email (24 hours after cancellation):**
"Sorry to see you go. Before you're fully gone, could you tell us why? [One question survey]"

Tone: Respectful, learning-focused
Goal: Gather feedback, leave door open

**Email (30 days after cancellation):**
"Things have changed since you left: [3 new features/improvements]. Want to give us another shot? Your old account is still here."

Tone: Confident but not pushy
Goal: Win-back with proof of improvement

**Win-Back Offer Structure:**
• For price objections: Discount or extended trial
• For missing features: Highlight what's new
• For poor experience: Apology + what changed
• For found alternative: Comparison showing your advantage

**What NOT to do:**
• Spam them
• Guilt them
• Make it hard to leave
• Not respect their decision`,
              notes:
                "Not everyone will come back. Focus on learning and improving for others.",
            },
          ],
        },
      },
    },
  };

  const currentContent = contentLibrary[selectedType];
  const currentCategory = currentContent.categories[selectedCategory];
  const ContentIcon = currentContent.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Advancia Pay Content Library
              </h1>
              <p className="text-slate-600">
                Ready-to-use examples and templates for every scenario
              </p>
            </div>
          </div>

          {/* Type Selector */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(contentLibrary).map(([key, lib]) => {
              const Icon = lib.icon;
              const colorMap = {
                blue: "bg-blue-500 hover:bg-blue-600",
                purple: "bg-purple-500 hover:bg-purple-600",
                green: "bg-green-500 hover:bg-green-600",
                orange: "bg-orange-500 hover:bg-orange-600",
              };
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedType(key);
                    setSelectedCategory(
                      Object.keys(contentLibrary[key].categories)[0]
                    );
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all ${
                    selectedType === key
                      ? colorMap[lib.color]
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{lib.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(currentContent.categories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedCategory === key
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Items */}
        <div className="space-y-6">
          {currentCategory.items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <ContentIcon
                    className={`w-6 h-6 text-${currentContent.color}-500`}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {item.title}
                    </h3>
                    {item.subject && (
                      <p className="text-sm text-slate-600 mt-1">
                        <span className="font-medium">Subject:</span>{" "}
                        {item.subject}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(item.content, item.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        Copied!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-600">
                        Copy
                      </span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                  {item.content}
                </pre>
              </div>

              {item.notes && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                  <p className="text-sm text-amber-900">
                    <span className="font-semibold">📝 Usage Notes:</span>{" "}
                    {item.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Reference */}
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-3">✨ Pro Tips</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-1">Personalize It</p>
              <p className="opacity-90">
                Replace [bracketed] sections with actual data
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Test First</p>
              <p className="opacity-90">
                Send to yourself before sending to users
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Track Performance</p>
              <p className="opacity-90">A/B test subject lines and CTAs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentLibrary;
