import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import {
  Button,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Dialog,
  DropdownMenu,
  FormField,
  Input,
  Skeleton,
  Tabs,
  Tooltip,
} from "@landing/ui-core";

describe("Button", () => {
  it("renders with label", () => {
    render(<Button>Start free</Button>);
    expect(screen.getByRole("button", { name: "Start free" })).toBeInTheDocument();
  });

  it("defaults to type=button (prevents accidental form submits)", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it.each([
    "primary",
    "secondary",
    "outline",
    "ghost",
    "destructive",
    "success",
  ] as const)("renders variant %s", (variant) => {
    render(<Button variant={variant}>Action</Button>);
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("applies the success feedback state over any variant", () => {
    render(<Button status="success" variant="primary">Saved</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("data-status", "success");
    expect(btn.className).toContain("bg-success-fg");
    expect(btn.className).not.toContain("bg-accent");
  });

  it("applies the error feedback state with destructive styling", () => {
    render(<Button status="error">Retry</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("data-status", "error");
    expect(btn.className).toContain("bg-error");
    expect(btn.className).not.toContain("bg-accent");
  });

  it("disables and sets aria-busy while loading", () => {
    render(<Button loading>Saving</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("is disabled when disabled prop set", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("hides decorative icons from assistive tech", () => {
    render(
      <Button iconLeft={<svg data-testid="icon" />}>With icon</Button>,
    );
    const icon = screen.getByTestId("icon");
    expect(icon.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Button variant="primary">CTA</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations in feedback states", async () => {
    const { container } = render(
      <div>
        <Button status="success">Saved</Button>
        <Button status="error">Failed</Button>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Accordion (FAQ base)", () => {
  const renderFaq = (type: "single" | "multiple" = "single") => (
    <Accordion type={type} defaultOpenIds={["q1"]}>
      <AccordionItem id="q1">
        <AccordionTrigger itemId="q1">What is this?</AccordionTrigger>
        <AccordionContent itemId="q1">A landing kit.</AccordionContent>
      </AccordionItem>
      <AccordionItem id="q2">
        <AccordionTrigger itemId="q2">Is it free?</AccordionTrigger>
        <AccordionContent itemId="q2">Yes.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  it("renders questions with aria-expanded wired", () => {
    render(renderFaq());
    const t1 = screen.getByRole("button", { name: /What is this/ });
    expect(t1).toHaveAttribute("aria-expanded", "true");
    expect(t1).toHaveAttribute("aria-controls", "q1-panel");
    const t2 = screen.getByRole("button", { name: /Is it free/ });
    expect(t2).toHaveAttribute("aria-expanded", "false");
  });

  it("opens a closed item on click", async () => {
    const user = userEvent.setup();
    render(renderFaq());
    await user.click(screen.getByRole("button", { name: /Is it free/ }));
    expect(screen.getByText("Yes.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Is it free/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("single mode closes the previously open item", async () => {
    const user = userEvent.setup();
    render(renderFaq("single"));
    await user.click(screen.getByRole("button", { name: /Is it free/ }));
    expect(screen.queryByText("A landing kit.")).not.toBeInTheDocument();
    expect(screen.getByText("Yes.")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(renderFaq());
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("FormField + Input", () => {
  it("associates label, hint and input", () => {
    render(
      <FormField label="Work email" htmlFor="email" hint="We never spam">
        <Input type="email" />
      </FormField>,
    );
    const input = screen.getByLabelText(/Work email/);
    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("aria-describedby", "email-hint");
    expect(screen.getByText("We never spam")).toHaveAttribute("id", "email-hint");
  });

  it("wires error with role=alert and aria-invalid", () => {
    render(
      <FormField label="Email" htmlFor="email2" error="Enter a valid email">
        <Input type="email" />
      </FormField>,
    );
    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email2-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email");
  });

  it("has no axe violations with error state", async () => {
    const { container } = render(
      <FormField label="Email" htmlFor="email3" error="Required">
        <Input />
      </FormField>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Skeleton", () => {
  it("renders a decorative placeholder", () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const node = container.firstElementChild;
    expect(node).toHaveAttribute("aria-hidden", "true");
    expect(node?.className).toContain("animate-pulse");
    expect(screen.queryByRole("img")).toBeNull();
  });
});

describe("Tooltip", () => {
  it("describes the trigger while open and dismisses on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Billed monthly">
        <button>Monthly</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Monthly" });
    expect(trigger).not.toHaveAttribute("aria-describedby");

    await user.tab();
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("Billed monthly");
    expect(trigger.getAttribute("aria-describedby")).toBe(tooltip.id);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Tooltip content="Helper text">
        <button>Help</button>
      </Tooltip>,
    );
    await user.tab();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Tabs", () => {
  const items = [
    { id: "monthly", label: "Monthly", content: <p>Pay every month</p> },
    { id: "yearly", label: "Yearly", content: <p>Two months free</p> },
  ];

  it("shows only the selected panel and wires aria relationships", () => {
    render(<Tabs items={items} aria-label="Billing period" />);
    const selected = screen.getByRole("tab", { name: "Monthly" });
    expect(selected).toHaveAttribute("aria-selected", "true");
    expect(selected).toHaveAttribute("tabindex", "0");

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("Pay every month");
    expect(panel.getAttribute("aria-labelledby")).toBe(selected.id);
    expect(selected.getAttribute("aria-controls")).toBe(panel.id);
    expect(screen.queryByText("Two months free")).toBeNull();
  });

  it("moves selection with arrow keys (roving tabindex)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs items={items} aria-label="Billing" onValueChange={onValueChange} />);

    screen.getByRole("tab", { name: "Monthly" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith("yearly");
    expect(screen.getByRole("tab", { name: "Yearly" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Two months free");

    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Monthly" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(<Tabs items={items} aria-label="Billing" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

function DialogHarness() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open dialog</button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete project"
        description="This action cannot be undone."
        footer={<button>Confirm delete</button>}
      >
        <p>Type the project name to confirm.</p>
      </Dialog>
    </div>
  );
}

describe("Dialog", () => {
  it("opens with a labelled modal, moves focus in and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);
    const opener = screen.getByRole("button", { name: "Open dialog" });

    await user.click(opener);
    const dialog = screen.getByRole("dialog", { name: "Delete project" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveTextContent("This action cannot be undone.");
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it("keeps Tab inside the dialog (focus trap)", async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    const dialog = screen.getByRole("dialog");
    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>("a[href], button"),
    );
    expect(focusables.length).toBeGreaterThan(1);
    focusables[focusables.length - 1]?.focus();

    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("has no axe violations when open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<DialogHarness />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});

describe("DropdownMenu", () => {
  const items = [
    { id: "profile", label: "Profile", href: "/settings" },
    { id: "signout", label: "Sign out" },
    { id: "export", label: "Export data", disabled: true },
  ];

  it("exposes the menu button pattern and opens on click", async () => {
    const user = userEvent.setup();
    render(<DropdownMenu label="Account" trigger="Account" items={items} />);
    const trigger = screen.getByRole("button", { name: "Account" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu", { name: "Account" })).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
    expect(screen.getByRole("menuitem", { name: "Profile" })).toHaveAttribute(
      "href",
      "/settings",
    );
    expect(
      screen.getByRole("menuitem", { name: "Export data" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<DropdownMenu label="Account" trigger="Account" items={items} />);
    const trigger = screen.getByRole("button", { name: "Account" });

    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("runs onSelect when an item is chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu
        label="Account"
        trigger="Account"
        items={[{ id: "signout", label: "Sign out", onSelect }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Account" }));
    await user.click(screen.getByRole("menuitem", { name: "Sign out" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("has no axe violations when open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DropdownMenu label="Account" trigger="Account" items={items} />,
    );
    await user.click(screen.getByRole("button", { name: "Account" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
