import { test } from "node:test";
import assert from "node:assert/strict";
import { makeUnsubscribeToken, readUnsubscribeToken, unsubscribeUrl } from "./email-unsubscribe";
import { htmlToText } from "./email-text";

const SECRET = "test-secret";

test("an unsubscribe link reads back what it was made for", () => {
  const community = makeUnsubscribeToken(
    { kind: "community", communityId: "c0ffee00-0000-0000-0000-000000000001", email: " Tanya@Example.com " },
    SECRET
  );
  assert.deepEqual(readUnsubscribeToken(community, SECRET), {
    kind: "community",
    communityId: "c0ffee00-0000-0000-0000-000000000001",
    email: "tanya@example.com",
  });

  const notification = makeUnsubscribeToken({ kind: "notification", userId: "u1", type: "post" }, SECRET);
  assert.deepEqual(readUnsubscribeToken(notification, SECRET), { kind: "notification", userId: "u1", type: "post" });
});

test("an edited or foreign unsubscribe link is refused", () => {
  const token = makeUnsubscribeToken({ kind: "community", communityId: "c1", email: "a@example.com" }, SECRET);
  const [, sig] = token.split(".");
  const forged = `${Buffer.from("c|c1|someone-else@example.com").toString("base64url")}.${sig}`;
  assert.equal(readUnsubscribeToken(forged, SECRET), null);
  assert.equal(readUnsubscribeToken(token, "another-secret"), null);
  assert.equal(readUnsubscribeToken("", SECRET), null);
  assert.equal(readUnsubscribeToken("nonsense", SECRET), null);
  assert.equal(readUnsubscribeToken(null, SECRET), null);
});

test("the unsubscribe address sits on the site", () => {
  assert.equal(unsubscribeUrl("https://www.relate.click/", "abc.def"), "https://www.relate.click/api/email/unsubscribe?t=abc.def");
});

test("an HTML email becomes readable plain text", () => {
  const html = `<!doctype html>
<html>
  <head><style>p { color: red; }</style></head>
  <body style="margin:0">
    <div><img src="cid:logo" alt="" />
      <h1 style="font-size:20px">You're invited to Escape&nbsp;Space</h1>
      <p>Tanya has invited you
         to join &amp; say hello.</p>
      <a href="https://www.relate.click/invite/abc" style="x">Join Escape Space</a>
      <p>Or copy this link:<br /><a href="https://www.relate.click/invite/abc">https://www.relate.click/invite/abc</a></p>
      <ul><li>One</li><li>Two</li></ul>
      <p>Write to <a href="mailto:hi@example.com">hi@example.com</a></p>
    </div>
  </body>
</html>`;
  assert.equal(
    htmlToText(html),
    [
      "You're invited to Escape Space",
      "",
      "Tanya has invited you to join & say hello.",
      "",
      "Join Escape Space (https://www.relate.click/invite/abc)",
      "",
      "Or copy this link:",
      "https://www.relate.click/invite/abc",
      "",
      "- One",
      "- Two",
      "",
      "Write to hi@example.com",
    ].join("\n")
  );
});
