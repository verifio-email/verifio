"use client";

import * as Button from "@verifio/ui/button";
import { CodeBlock } from "@verifio/ui/code-block";
import { Icon } from "@verifio/ui/icon";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, type ReactNode, useState } from "react";
import { Go, Nodejs, Php, Python } from "./language-svg";

type LanguageType = {
	id: string;
	name: string;
	icon: ReactNode;
	lang: string;
	// Hardcoded widths to avoid race conditions with animations
	collapsedWidth: number; // Width when just icon is shown
	expandedWidth: number; // Width when icon + name is shown
};

// Tab widths: padding (24px) + icon width + gap (8px) + text width
// Collapsed = just icon, Expanded = icon + gap + text
const languages: LanguageType[] = [
	{
		id: "python",
		name: "Python",
		icon: <Python className="h-5 w-5" />,
		lang: "python",
		collapsedWidth: 44, // 24px padding + 20px icon
		expandedWidth: 95, // 44 + 8px gap + ~43px text
	},
	{
		id: "node",
		name: "Node.js",
		icon: <Nodejs className="h-5 w-5" />,
		lang: "javascript",
		collapsedWidth: 44,
		expandedWidth: 105, // 44 + 8px gap + ~53px text
	},
	{
		id: "go",
		name: "Go",
		icon: <Go className="h-4 w-11" />,
		lang: "go",
		collapsedWidth: 68, // 24px padding + 44px icon (w-11)
		expandedWidth: 95, // 68 + 8px gap + ~19px text
	},
	{
		id: "php",
		name: "PHP",
		icon: <Php className="h-5 w-8" />,
		lang: "php",
		collapsedWidth: 56, // 24px padding + 32px icon (w-8)
		expandedWidth: 95, // 56 + 8px gap + ~31px text
	},
];

const features = [
	{
		id: "signup",
		icon: "user-plus" as const,
		title: "User signup & onboarding",
		description:
			"Verify emails at the point of entry to prevent fake signups and reduce friction for real users.",
		code: {
			python: `from verifio import Verifio, VerifyParams

verifio = Verifio()

params = VerifyParams(
    email=request.form['email'],
)
result = verifio.verify(params)

# Block signup if email is invalid
if not result.valid:
    return {"error": f"Invalid email: {result.reason}"}

# Check for disposable emails
if result.is_disposable:
    return {"error": "Disposable emails not allowed"}

# Proceed with user registration
user = create_user(email=params.email)
send_welcome_email(user)

verifio.close()`,
			node: `import Verifio from '@verifio/sdk';

const verifio = new Verifio({
  url: 'https://api.verifio.email',
  key: 'your-api-key'
});

// Verify during signup
const result = await verifio.verify.email({
  email: req.body.email
});

// Block signup if email is invalid
if (!result.valid) {
  return res.status(400).json({
    error: \`Invalid email: \${result.reason}\`
  });
}

// Check for disposable emails
if (result.disposable) {
  return res.status(400).json({
    error: 'Disposable emails not allowed'
  });
}

// Proceed with user registration
const user = await createUser({ email: req.body.email });
await sendWelcomeEmail(user);`,
			go: `package main

import (
  "github.com/verifio/sdk-go"
)

func handleSignup(email string) error {
  client := verifio.NewClient("your-api-key")

  result, err := client.Verify.Email(&verifio.VerifyRequest{
    Email: email,
  })

  if err != nil {
    return err
  }

  // Block signup if email is invalid
  if !result.Valid {
    return fmt.Errorf("Invalid email: %s", result.Reason)
  }

  // Check for disposable emails
  if result.Disposable {
    return fmt.Errorf("Disposable emails not allowed")
  }

  // Proceed with user registration
  user := createUser(email)
  sendWelcomeEmail(user)
  return nil
}`,
			php: `<?php

require 'vendor/autoload.php';

use Verifio\\Verifio;

$verifio = new Verifio([
  'url' => 'https://api.verifio.email',
  'key' => 'your-api-key'
]);

// Verify during signup
$result = $verifio->verify->email([
  'email' => $_POST['email']
]);

// Block signup if email is invalid
if (!$result['valid']) {
  http_response_code(400);
  echo json_encode([
    'error' => 'Invalid email: ' . $result['reason']
  ]);
  exit;
}

// Check for disposable emails
if ($result['disposable']) {
  http_response_code(400);
  echo json_encode([
    'error' => 'Disposable emails not allowed'
  ]);
  exit;
}

// Proceed with user registration
$user = createUser($_POST['email']);
sendWelcomeEmail($user);`,
		},
	},
	{
		id: "leads",
		icon: "inbox" as const,
		title: "Lead capture forms",
		description:
			"Ensure clean data from day one. Validate leads before they enter your CRM or marketing pipeline.",
		code: {
			python: `from verifio import Verifio, VerifyParams

verifio = Verifio()

# Validate lead email in real-time
def validate_lead(lead_data):
    params = VerifyParams(
        email=lead_data['email'],
    )
    result = verifio.verify(params)
    
    # Only accept high-quality leads
    if result.valid and result.score >= 80:
        save_to_crm(lead_data)
        return {"status": "success", "score": result.score}
    
    return {"status": "rejected", "reason": result.reason}

# Process incoming lead
lead = {"email": "contact@company.com", "name": "John"}
response = validate_lead(lead)
print(f"Lead status: {response}")

verifio.close()`,
			node: `import Verifio from '@verifio/sdk';

const verifio = new Verifio({
  url: 'https://api.verifio.email',
  key: 'your-api-key'
});

// Validate lead email in real-time
async function validateLead(leadData) {
  const result = await verifio.verify.email({
    email: leadData.email
  });

  // Only accept high-quality leads
  if (result.valid && result.score >= 80) {
    await saveToCRM(leadData);
    return { status: 'success', score: result.score };
  }

  return { status: 'rejected', reason: result.reason };
}

// Process incoming lead
const lead = { email: 'contact@company.com', name: 'John' };
const response = await validateLead(lead);
console.log('Lead status:', response);`,
			go: `package main

import (
  "github.com/verifio/sdk-go"
)

type LeadData struct {
  Email string
  Name  string
}

func validateLead(lead LeadData) (map[string]interface{}, error) {
  client := verifio.NewClient("your-api-key")

  result, err := client.Verify.Email(&verifio.VerifyRequest{
    Email: lead.Email,
  })

  if err != nil {
    return nil, err
  }

  // Only accept high-quality leads
  if result.Valid && result.Score >= 80 {
    saveToCRM(lead)
    return map[string]interface{}{
      "status": "success",
      "score":  result.Score,
    }, nil
  }

  return map[string]interface{}{
    "status": "rejected",
    "reason": result.Reason,
  }, nil
}`,
			php: `<?php

require 'vendor/autoload.php';

use Verifio\\Verifio;

$verifio = new Verifio([
  'url' => 'https://api.verifio.email',
  'key' => 'your-api-key'
]);

// Validate lead email in real-time
function validateLead($verifio, $leadData) {
  $result = $verifio->verify->email([
    'email' => $leadData['email']
  ]);

  // Only accept high-quality leads
  if ($result['valid'] && $result['score'] >= 80) {
    saveToCRM($leadData);
    return ['status' => 'success', 'score' => $result['score']];
  }

  return ['status' => 'rejected', 'reason' => $result['reason']];
}

// Process incoming lead
$lead = ['email' => 'contact@company.com', 'name' => 'John'];
$response = validateLead($verifio, $lead);
print_r($response);`,
		},
	},
	{
		id: "crm",
		icon: "users" as const,
		title: "CRM & marketing pipelines",
		description:
			"Protect your sender reputation by removing invalid emails before campaigns go out.",
		code: {
			python: `from verifio import Verifio, VerifyParams

verifio = Verifio()

# Clean your contact list before a campaign
def clean_contact_list(contacts):
    valid_contacts = []
    invalid_contacts = []
    
    for contact in contacts:
        result = verifio.verify(VerifyParams(
            email=contact['email']
        ))
        
        if result.valid and not result.is_catch_all:
            valid_contacts.append(contact)
        else:
            invalid_contacts.append({
                **contact,
                "reason": result.reason
            })
    
    return valid_contacts, invalid_contacts

# Run before sending campaign
valid, invalid = clean_contact_list(marketing_list)
print(f"Ready to send: {len(valid)} emails")
print(f"Removed: {len(invalid)} invalid emails")

verifio.close()`,
			node: `import Verifio from '@verifio/sdk';

const verifio = new Verifio({
  url: 'https://api.verifio.email',
  key: 'your-api-key'
});

// Clean your contact list before a campaign
async function cleanContactList(contacts) {
  const validContacts = [];
  const invalidContacts = [];

  for (const contact of contacts) {
    const result = await verifio.verify.email({
      email: contact.email
    });

    if (result.valid && !result.catchAll) {
      validContacts.push(contact);
    } else {
      invalidContacts.push({
        ...contact,
        reason: result.reason
      });
    }
  }

  return { validContacts, invalidContacts };
}

// Run before sending campaign
const { validContacts, invalidContacts } = await cleanContactList(marketingList);
console.log(\`Ready to send: \${validContacts.length} emails\`);
console.log(\`Removed: \${invalidContacts.length} invalid emails\`);`,
			go: `package main

import (
  "github.com/verifio/sdk-go"
)

type Contact struct {
  Email  string
  Name   string
  Reason string
}

func cleanContactList(contacts []Contact) ([]Contact, []Contact) {
  client := verifio.NewClient("your-api-key")
  
  var validContacts []Contact
  var invalidContacts []Contact

  for _, contact := range contacts {
    result, _ := client.Verify.Email(&verifio.VerifyRequest{
      Email: contact.Email,
    })

    if result.Valid && !result.CatchAll {
      validContacts = append(validContacts, contact)
    } else {
      contact.Reason = result.Reason
      invalidContacts = append(invalidContacts, contact)
    }
  }

  return validContacts, invalidContacts
}

// Run before sending campaign
valid, invalid := cleanContactList(marketingList)
fmt.Printf("Ready to send: %d emails\\n", len(valid))
fmt.Printf("Removed: %d invalid emails\\n", len(invalid))`,
			php: `<?php

require 'vendor/autoload.php';

use Verifio\\Verifio;

$verifio = new Verifio([
  'url' => 'https://api.verifio.email',
  'key' => 'your-api-key'
]);

// Clean your contact list before a campaign
function cleanContactList($verifio, $contacts) {
  $validContacts = [];
  $invalidContacts = [];

  foreach ($contacts as $contact) {
    $result = $verifio->verify->email([
      'email' => $contact['email']
    ]);

    if ($result['valid'] && !$result['catch_all']) {
      $validContacts[] = $contact;
    } else {
      $contact['reason'] = $result['reason'];
      $invalidContacts[] = $contact;
    }
  }

  return [$validContacts, $invalidContacts];
}

// Run before sending campaign
[$valid, $invalid] = cleanContactList($verifio, $marketingList);
echo "Ready to send: " . count($valid) . " emails\\n";
echo "Removed: " . count($invalid) . " invalid emails\\n";`,
		},
	},
	{
		id: "data",
		icon: "database" as const,
		title: "Bulk data cleaning",
		description:
			"Process thousands of emails at scale. Perfect for list hygiene and data enrichment workflows.",
		code: {
			python: `from verifio import Verifio, BatchVerifyParams

verifio = Verifio()

# Batch verify emails at scale
emails = load_emails_from_csv("contacts.csv")

params = BatchVerifyParams(
    emails=emails,
    concurrency=50,  # Process 50 emails in parallel
)
results = verifio.verify_batch(params)

# Generate verification report
valid_count = sum(1 for r in results if r.valid)
invalid_count = len(results) - valid_count

print(f"Total processed: {len(results)}")
print(f"Valid emails: {valid_count}")
print(f"Invalid emails: {invalid_count}")

# Export clean list
clean_emails = [r.email for r in results if r.valid]
save_to_csv("clean_contacts.csv", clean_emails)

verifio.close()`,
			node: `import Verifio from '@verifio/sdk';

const verifio = new Verifio({
  url: 'https://api.verifio.email',
  key: 'your-api-key'
});

// Batch verify emails at scale
const emails = await loadEmailsFromCSV('contacts.csv');

const results = await verifio.verify.batch({
  emails,
  concurrency: 50 // Process 50 emails in parallel
});

// Generate verification report
const validCount = results.filter(r => r.valid).length;
const invalidCount = results.length - validCount;

console.log(\`Total processed: \${results.length}\`);
console.log(\`Valid emails: \${validCount}\`);
console.log(\`Invalid emails: \${invalidCount}\`);

// Export clean list
const cleanEmails = results
  .filter(r => r.valid)
  .map(r => r.email);
await saveToCSV('clean_contacts.csv', cleanEmails);`,
			go: `package main

import (
  "github.com/verifio/sdk-go"
)

func main() {
  client := verifio.NewClient("your-api-key")

  // Batch verify emails at scale
  emails := loadEmailsFromCSV("contacts.csv")

  results, _ := client.Verify.Batch(&verifio.BatchRequest{
    Emails:      emails,
    Concurrency: 50, // Process 50 emails in parallel
  })

  // Generate verification report
  validCount := 0
  var cleanEmails []string

  for _, r := range results {
    if r.Valid {
      validCount++
      cleanEmails = append(cleanEmails, r.Email)
    }
  }

  invalidCount := len(results) - validCount

  fmt.Printf("Total processed: %d\\n", len(results))
  fmt.Printf("Valid emails: %d\\n", validCount)
  fmt.Printf("Invalid emails: %d\\n", invalidCount)

  // Export clean list
  saveToCSV("clean_contacts.csv", cleanEmails)
}`,
			php: `<?php

require 'vendor/autoload.php';

use Verifio\\Verifio;

$verifio = new Verifio([
  'url' => 'https://api.verifio.email',
  'key' => 'your-api-key'
]);

// Batch verify emails at scale
$emails = loadEmailsFromCSV('contacts.csv');

$results = $verifio->verify->batch([
  'emails' => $emails,
  'concurrency' => 50 // Process 50 emails in parallel
]);

// Generate verification report
$validEmails = array_filter($results, fn($r) => $r['valid']);
$validCount = count($validEmails);
$invalidCount = count($results) - $validCount;

echo "Total processed: " . count($results) . "\\n";
echo "Valid emails: " . $validCount . "\\n";
echo "Invalid emails: " . $invalidCount . "\\n";

// Export clean list
$cleanEmails = array_map(fn($r) => $r['email'], $validEmails);
saveToCSV('clean_contacts.csv', $cleanEmails);`,
		},
	},
];

const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		console.error("Failed to copy:", err);
	}
};

function TerminalWindow({
	children,
	onCopy,
	selectedLanguage,
	onLanguageChange,
}: {
	children: React.ReactNode;
	onCopy: () => void;
	selectedLanguage: LanguageType;
	onLanguageChange: (lang: LanguageType) => void;
}) {
	// Calculate indicator position based on hardcoded widths
	const getIndicatorStyle = () => {
		const activeIndex = languages.findIndex(
			(lang) => lang.id === selectedLanguage.id,
		);

		// Calculate left position: sum of all previous tab widths + margins + dividers
		// Each tab has mx-2 (8px on each side) = 16px total margin per tab
		// Each divider is 1px
		let left = 8; // Initial left margin (mx-2)
		for (let i = 0; i < activeIndex; i++) {
			const lang = languages[i];
			if (lang) {
				// Use collapsed width for non-active tabs
				left += lang.collapsedWidth + 16 + 1; // width + margins + divider
			}
		}

		// Get the width of the active tab (expanded)
		const activeTab = languages[activeIndex];
		const width = activeTab?.expandedWidth || 0;

		return { width, left };
	};

	const indicatorStyle = getIndicatorStyle();

	return (
		<div className="overflow-hidden">
			{/* Terminal Header with macOS controls */}
			<div className="flex items-center justify-between border-stroke-soft-100/60 border-b px-4 py-3 dark:border-stroke-soft-100/40">
				{/* macOS-style window controls */}
				<div className="flex items-center gap-2">
					<div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
					<div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
					<div className="h-3 w-3 rounded-full bg-[#27ca40]" />
				</div>
				{/* Copy button */}
				<button
					type="button"
					onClick={onCopy}
					className="flex h-7 w-7 items-center justify-center rounded-md text-text-sub-600 transition-colors hover:bg-bg-soft-200 hover:text-text-strong-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
				>
					<Icon name="copy" className="h-4 w-4" />
				</button>
			</div>

			{/* Language Tabs */}
			<div className="overflow-x-auto border-stroke-soft-100/60 border-b dark:border-stroke-soft-100/40">
				<div className="relative flex w-fit min-w-full items-stretch bg-bg-white-0 dark:bg-transparent">
					<motion.div
						className="absolute inset-y-2 rounded-full border border-stroke-soft-200 dark:border-stroke-soft-200"
						animate={{
							left: indicatorStyle.left,
							width: indicatorStyle.width,
						}}
						transition={{
							type: "spring",
							stiffness: 500,
							damping: 35,
						}}
						aria-hidden="true"
					/>
					{languages.map((lang, index) => (
						<Fragment key={lang.id}>
							<div className="relative z-10 mx-2 flex flex-col justify-center py-2">
								<button
									type="button"
									onClick={() => onLanguageChange(lang)}
									className="flex cursor-pointer items-center gap-2 rounded-full border border-transparent px-3 py-2 transition-colors"
								>
									<span className="text-base">{lang.icon}</span>
									<AnimatePresence initial={false}>
										{selectedLanguage.id === lang.id && (
											<motion.span
												key={lang.id}
												initial={{ width: 0, opacity: 0 }}
												animate={{ width: "auto", opacity: 1 }}
												exit={{ width: 0, opacity: 0 }}
												transition={{
													duration: 0.15,
													ease: "easeOut",
												}}
												className="overflow-hidden whitespace-nowrap font-medium text-text-strong-950 text-xs dark:text-white"
											>
												{lang.name}
											</motion.span>
										)}
									</AnimatePresence>
								</button>
							</div>
							{index < languages.length && (
								<div className="w-px bg-stroke-soft-200/60 dark:bg-stroke-soft-100/20" />
							)}
						</Fragment>
					))}
				</div>
			</div>

			{/* Terminal Content */}
			<div className="max-h-[380px] overflow-auto">{children}</div>
		</div>
	);
}

function FeatureItem({
	feature,
	isActive,
	onClick,
	isLast,
}: {
	feature: (typeof features)[0];
	isActive: boolean;
	onClick: () => void;
	isLast: boolean;
}) {
	return (
		<div>
			<button
				type="button"
				onClick={onClick}
				className={`group w-full cursor-pointer px-6 py-6 text-left transition-all ${
					isActive
						? "bg-bg-weak-50 dark:bg-neutral-800/60"
						: "hover:bg-bg-soft-200/50 dark:hover:bg-neutral-800/30"
				}`}
			>
				{/* Icon + Title */}
				<div className="mb-2 flex items-center gap-3">
					<Icon
						name={feature.icon}
						className={`h-4 w-4 ${
							isActive
								? "text-text-strong-950 dark:text-white"
								: "text-text-sub-600 dark:text-gray-400"
						}`}
					/>
					<h4
						className={`font-semibold text-base ${
							isActive
								? "text-text-strong-950 dark:text-white"
								: "text-text-sub-600 dark:text-gray-300"
						}`}
					>
						{feature.title}
					</h4>
				</div>
				{/* Description */}
				<p className="text-sm text-text-soft-400 leading-relaxed dark:text-gray-500">
					{feature.description}
				</p>
			</button>
			{/* Divider line */}
			{!isLast && (
				<div className="border-stroke-soft-100/60 border-b dark:border-stroke-soft-100/40" />
			)}
		</div>
	);
}

export function UseCases() {
	const [activeFeature, setActiveFeature] = useState(features[0]);
	const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>(
		languages[0] as LanguageType,
	);
	const [copied, setCopied] = useState(false);

	const getCurrentCode = () => {
		if (!activeFeature) return "";
		const codeObj = activeFeature.code as Record<string, string>;
		return codeObj[selectedLanguage.id] || "";
	};

	const handleCopy = async () => {
		await copyToClipboard(getCurrentCode());
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="border-stroke-soft-100/60 border-t border-b dark:border-stroke-soft-100/40">
			<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l dark:border-stroke-soft-100/40">
				{/* Sticky Header */}
				<div className="sticky top-[66px] z-20 flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-4 md:px-10 dark:border-stroke-soft-100/40">
					<span className="text-text-sub-600 text-xs">[05] USE CASES</span>
					<span className="text-text-sub-600 text-xs">
						/ BUILT FOR REAL PRODUCTS
					</span>
				</div>

				{/* Main Content - Split Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-2">
					{/* Left Column - Features List */}
					<div className="flex flex-col border-stroke-soft-100/60 lg:border-r dark:border-stroke-soft-100/40">
						{features.map((feature, index) => (
							<FeatureItem
								key={feature.id}
								feature={feature}
								isActive={activeFeature?.id === feature.id}
								onClick={() => setActiveFeature(feature)}
								isLast={index === features.length - 1}
							/>
						))}
					</div>

					{/* Right Column - Code Block with Language Tabs */}
					<div>
						<TerminalWindow
							onCopy={handleCopy}
							selectedLanguage={selectedLanguage}
							onLanguageChange={setSelectedLanguage}
						>
							<CodeBlock code={getCurrentCode()} lang={selectedLanguage.lang} />
						</TerminalWindow>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-center gap-3 border-stroke-soft-100/60 border-t px-6 py-6 text-center dark:border-stroke-soft-100/40">
					<p className="text-sm text-text-sub-600">
						If email quality matters to your product,{" "}
						<span className="font-semibold text-text-strong-950">
							Verifio fits
						</span>
						.
					</p>
				</div>
			</div>
		</div>
	);
}

export default UseCases;
