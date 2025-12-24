"use client";

import * as Button from "@verifio/ui/button";
import * as Input from "@verifio/ui/input";
import * as Textarea from "@verifio/ui/textarea";
import Spinner from "@verifio/ui/spinner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import type { Resolver } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

const contactSchema = v.object({
    email: v.pipe(
        v.string("Email is required"),
        v.minLength(1, "Email is required"),
        v.email("Please enter a valid email address"),
    ),
    message: v.pipe(
        v.string("Message is required"),
        v.minLength(10, "Message must be at least 10 characters"),
    ),
});

type ContactFormData = v.InferInput<typeof contactSchema>;

export function ContactForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormData>({
        resolver: valibotResolver(contactSchema) as Resolver<ContactFormData>,
        mode: "onChange",
    });

    const onSubmit = async (data: ContactFormData) => {
        // TODO: Add actual form submission logic here
        console.log("Submitting:", data);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitted(true);
    };

    const successVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    const checkmarkVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                delay: 0.2,
                ease: "easeOut",
            },
        },
    };

    return (
        <AnimatePresence mode="wait">
            {isSubmitted ? (
                <motion.div
                    key="success"
                    variants={successVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex h-full min-h-[300px] flex-col items-center justify-center text-center"
                >
                    <motion.div
                        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, ease: "backOut" }}
                    >
                        <motion.svg
                            className="size-8 text-primary-base"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <motion.polyline
                                points="4 12 9 17 20 6"
                                variants={checkmarkVariants}
                                initial="hidden"
                                animate="visible"
                            />
                        </motion.svg>
                    </motion.div>
                    <motion.h3
                        className="font-semibold text-text-strong-950 text-xl"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Message sent!
                    </motion.h3>
                    <motion.p
                        className="mt-2 text-text-sub-600"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        We'll get back to you within 24 hours.
                    </motion.p>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block font-medium text-sm text-text-strong-950"
                        >
                            Email Address
                        </label>
                        <div className="mt-2">
                            <Input.Root size="medium" hasError={!!errors.email}>
                                <Input.Wrapper>
                                    <Input.Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...register("email")}
                                    />
                                </Input.Wrapper>
                            </Input.Root>
                        </div>
                        {errors.email && (
                            <p className="mt-1.5 text-error-base text-xs">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Message */}
                    <div>
                        <label
                            htmlFor="message"
                            className="block font-medium text-sm text-text-strong-950"
                        >
                            How can we help?
                        </label>
                        <div className="mt-2">
                            <Textarea.Root
                                simple
                                id="message"
                                placeholder="Tell us what we can help you with"
                                hasError={!!errors.message}
                                {...register("message")}
                            />
                        </div>
                        {errors.message && (
                            <p className="mt-1.5 text-error-base text-xs">
                                {errors.message.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <Button.Root
                            type="submit"
                            variant="primary"
                            size="medium"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Spinner size={16} /> : "Send Message"}
                        </Button.Root>
                    </div>
                </form>
            )}
        </AnimatePresence>
    );
}
