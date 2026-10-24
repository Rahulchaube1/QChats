# Privacy Policy for QChats

**Last updated:** October 25, 2026

**QChats** is an open-source, decentralized, peer-to-peer messaging application designed from the ground up for zero-knowledge privacy and off-grid communications.

---

### 1. Zero Data Collection
- **No Account Required:** QChats does not ask for phone numbers, email addresses, or personal identities.
- **No Central Servers:** QChats operates without central servers, cloud databases, or tracking infrastructure.
- **Local Storage Only:** All messages, media, and contact keys are stored solely on your device in an encrypted local database (SQLCipher with ChaCha20-Poly1305 encryption).

### 2. End-to-End Encryption
- All direct communications and group messages are encrypted end-to-end using state-of-the-art cryptographic protocols (Ed25519 signatures, X25519 key exchange, and ChaCha20-Poly1305 symmetric encryption).
- Only the intended recipient(s) can decrypt and read your messages.

### 3. Permissions & Usage
- **Bluetooth & Local Wi-Fi (Multicast):** Used exclusively for discovery and direct relay of messages to nearby peer devices when operating in offline mesh mode.
- **Camera / Photos (Optional):** Used strictly when you choose to scan a peer's QR code or attach an image to a conversation. No photos are sent to third parties.
- **Microphone (Optional):** Used only when recording voice notes that you explicitly choose to send.
- **Location (Optional):** Used only if you explicitly tap the "Live GPS" button to share your coordinates with trusted peers.

### 4. Third-Party Sharing
We do not sell, rent, monetize, or transmit your data to any third parties, advertisers, or analytics platforms.

### 5. Contact
For any questions regarding this policy or the open-source codebase, contact:
- **Email:** support@qchats.app (or your developer email)
- **Repository:** https://github.com/RahulChaube/berty
