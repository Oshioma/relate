// Single source of truth for the Community Owner Agreement — the short,
// mandatory contract an owner accepts when creating a community, separate from
// the general Terms & Conditions. The wizard checkbox, the public read page
// (/community-owner-agreement) and the acceptance record stored on the
// community all reference the values here so they can never drift apart.

// The version an owner accepts is the Agreement's "last updated" date, stored
// on the community as owner_agreement_version. Bump BOTH of these together
// whenever the text below changes so new communities record the new version.
export const OWNER_AGREEMENT_VERSION = "2026-08-02";
export const OWNER_AGREEMENT_UPDATED_LABEL = "2 August 2026";

// The bold sentence shown above the checkbox on the onboarding screen and at
// the foot of the read page — the substance of what the owner is confirming.
export const OWNER_AGREEMENT_ACCEPTANCE =
  "I understand that I am responsible for my community, its content, members, subscriptions, payments, refunds, products and services, and that relate.click provides the technology platform only.";

// The checkbox label itself. Links to the full Agreement and Terms are rendered
// separately alongside it (see StepLaunch).
export const OWNER_AGREEMENT_CHECKBOX_LABEL =
  "I agree to the Community Owner Agreement and relate.click Terms & Conditions.";

// The full Agreement, in the light Markdown the app's <RichText> renderer
// understands (headings, bullet lists, bold, relative links). Kept as one
// constant so the read page renders exactly the text owners agree to.
export const OWNER_AGREEMENT_MARKDOWN = `By creating or operating a community on relate.click, you agree to the following:

## 1. Your Community, Your Responsibility

relate.click provides the software. You operate the community.

As the Community Owner, you are responsible for:

- your community and its members;
- content posted within your community;
- moderation and member behaviour;
- membership prices and subscriptions;
- products, services, events or advice you offer;
- refunds, cancellations and disputes;
- taxes relating to your income; and
- complying with laws applicable to your community.

## 2. Your Members Pay You

If you charge for membership, you connect your own Stripe account.

Membership payments are transactions between you and your members, not between members and relate.click.

You are responsible for your pricing, billing, refunds, cancellations, chargebacks and any promises you make to members.

relate.click is not responsible for money owed between you and your members.

## 3. Your Content

You are responsible for content published within your community, including content posted by your administrators, moderators and members.

You must take reasonable steps to remove unlawful or seriously harmful content when you become aware of it.

relate.click may remove content or suspend a community where necessary to protect the platform, its users or comply with law.

## 4. Your Own Rules

You are responsible for making sure your community has any additional terms, refund policies, privacy information, disclaimers or other policies required for the activities you provide.

## 5. Claims Against Your Community

If a claim, dispute, refund request, chargeback or legal issue arises because of your community, its content, members, subscriptions, products or services, you are responsible for dealing with it.

To the extent permitted by law, you agree to indemnify and hold relate.click harmless against claims, losses, damages or reasonable costs resulting from your operation of the community or your breach of this Agreement.

## 6. relate.click Is the Platform Provider

relate.click does not operate, endorse or guarantee your community, content, products, services or advice.

We provide the technology that enables you to operate your community.

## 7. Platform Terms

This Community Owner Agreement forms part of the relate.click [Terms & Conditions](/terms).

If you stop operating your community, you remain responsible for obligations already owed to your members.

This Agreement is governed by the laws of England and Wales.

## Owner Acceptance

By creating a community, you confirm that:

**${OWNER_AGREEMENT_ACCEPTANCE}**

When you create a community you tick a checkbox confirming: "${OWNER_AGREEMENT_CHECKBOX_LABEL}" We record the moment you accept, and the version of this Agreement you accepted, against your community.`;
