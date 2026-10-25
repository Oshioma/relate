import { test } from "node:test";
import assert from "node:assert/strict";
import {
  fillPlaceholders,
  firstNameOf,
  isOwnJoinNotificationTitle,
  renderCommunityEmail,
  sanitizeEmailHtml,
} from "./email-templates";

test("placeholders are filled however they are written", () => {
  const values = { firstName: "Amina", hostName: "Niko Dey", hostEmail: "niko@example.com", communityName: "Escape Space" };
  assert.equal(fillPlaceholders("Greetings {First_Name}", values), "Greetings Amina");
  assert.equal(fillPlaceholders("{first name} / {HOST-NAME} / {Host_Email}", values), "Amina / Niko Dey / niko@example.com");
  assert.equal(fillPlaceholders("{Host name and/or host email} invited you", values), "Niko Dey invited you");
  assert.equal(fillPlaceholders("Join {Community_Name}", values), "Join Escape Space");
});

test("missing names fall back sensibly and unknown placeholders stay visible", () => {
  assert.equal(fillPlaceholders("Hi {First_Name}", {}), "Hi friend");
  assert.equal(fillPlaceholders("{Host_Name} invited you", { hostEmail: "niko@example.com" }), "niko@example.com invited you");
  assert.equal(fillPlaceholders("See {Nonsense}", {}), "See {Nonsense}");
});

test("values are escaped in HTML but not in a subject", () => {
  assert.equal(fillPlaceholders("<p>{First_Name}</p>", { firstName: "<b>A&B</b>" }, { html: true }), "<p>&lt;b&gt;A&amp;B&lt;/b&gt;</p>");
  assert.equal(fillPlaceholders("Hi {First_Name}", { firstName: "A&B" }), "Hi A&B");
});

test("first names come from the first word of a full name", () => {
  assert.equal(firstNameOf("Niko Dey"), "Niko");
  assert.equal(firstNameOf("  "), null);
  assert.equal(firstNameOf(null), null);
});

test("email HTML loses scripts, handlers, video and unsafe links but keeps pictures", () => {
  const out = sanitizeEmailHtml(
    '<p onclick="x()">Hi</p><script>alert(1)</script><a href="javascript:alert(1)">bad</a>' +
      '<a href="https://relate.click">good</a><img src="https://x.test/a.png" width="2000"><video src="https://x.test/v.mp4"></video>'
  );
  assert.ok(!out.includes("onclick"));
  assert.ok(!out.includes("script"));
  assert.ok(!out.includes("javascript:"));
  assert.ok(!out.includes("video"));
  assert.ok(out.includes('href="https://relate.click"'));
  assert.ok(out.includes('src="https://x.test/a.png"'));
  assert.ok(out.includes("max-width:100%"));
  assert.ok(!out.includes('width="2000"'));
});

test("a rendered email carries the subject, words, button and pictures", () => {
  const email = renderCommunityEmail({
    template: {
      kind: "invite_new",
      subject: "Niko Dey has invited you to join Escape Space Community",
      body_html: "<p>Greetings {First_Name}</p>",
      footer_html: "<p>If you think you have received this invitation in error, please ignore this email.</p>",
      button_label: "Accept Invitation",
      logo_url: null,
      banner_url: "https://x.test/banner.jpg",
    },
    communityName: "Escape Space",
    communityLogoUrl: "https://x.test/logo.png",
    values: { firstName: "Amina" },
    buttonUrl: "https://relate.click/invite/abc",
  });
  assert.equal(email.subject, "Niko Dey has invited you to join Escape Space Community");
  assert.ok(email.html.includes("Greetings Amina"));
  assert.ok(email.html.includes("Accept Invitation"));
  assert.ok(email.html.includes('href="https://relate.click/invite/abc"'));
  assert.ok(email.html.includes("https://x.test/logo.png"));
  assert.ok(email.html.includes("https://x.test/banner.jpg"));
  assert.ok(email.html.includes("received this invitation in error"));
});

test("only a member's own join notification counts as a welcome moment", () => {
  assert.ok(isOwnJoinNotificationTitle("You joined Escape Space"));
  assert.ok(isOwnJoinNotificationTitle("You're now a member of Escape Space"));
  assert.ok(!isOwnJoinNotificationTitle("You are now admin in Escape Space"));
  assert.ok(!isOwnJoinNotificationTitle("Amina joined Escape Space"));
});
