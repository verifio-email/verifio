"use client";

import * as Button from "@verifio/ui/button";
import * as Input from "@verifio/ui/input";
import { useState } from "react";

export const NewsletterSignup = () => {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = () => {
        if (email) {
            // TODO: Add actual subscription logic here
            setIsSubscribed(true);
        }
    };

    return (
        <div className="border-stroke-soft-100 border-b p-6">
            {isSubscribed ? (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
                        <svg
                            className="size-6 text-green-600"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <p className="mt-3 font-semibold text-text-strong-950">
                        You&apos;re in!
                    </p>
                    <p className="mt-1 text-sm text-text-sub-600">
                        Thanks for subscribing. We&apos;ll keep you updated.
                    </p>
                </div>
            ) : (
                <>
                    <p className="font-medium text-sm text-text-strong-950">
                        Stay updated
                    </p>
                    <p className="mt-1 text-text-sub-600 text-xs">
                        Get email deliverability tips & product updates
                    </p>
                    <div className="mt-4 flex gap-2">
                        <Input.Root size="small" className="min-w-0 flex-1">
                            <Input.Wrapper>
                                <Input.Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Input.Wrapper>
                        </Input.Root>
                        <Button.Root
                            type="button"
                            variant="neutral"
                            size="small"
                            className="shrink-0"
                            onClick={handleSubscribe}
                        >
                            Subscribe
                        </Button.Root>
                    </div>
                </>
            )}
        </div>
    );
};
