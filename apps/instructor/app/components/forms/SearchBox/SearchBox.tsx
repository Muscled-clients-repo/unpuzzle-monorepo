"use client";
import React, { useState } from "react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onSearch?: (query: string) => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "outline";
  showSearchButton?: boolean;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search...",
  value: controlledValue,
  onSearch,
  onChange,
  onClear,
  disabled = false,
  size = "md",
  variant = "outline",
  showSearchButton = false,
  className = "",
}) => {
  const [internalValue, setInternalValue] = useState("");
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
  };

  const handleSearch = () => {
    onSearch?.(value);
  };

  const handleClear = () => {
    if (controlledValue === undefined) {
      setInternalValue("");
    }
    onClear?.();
    onChange?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
    
    if (e.key === 'Escape' && value) {
      handleClear();
    }
  };

  const searchIcon = (
    <Icon>
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </Icon>
  );

  const clearIcon = value ? (
    <Icon onClick={handleClear} className="cursor-pointer hover:text-gray-700">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </Icon>
  ) : null;

  if (showSearchButton) {
    return (
      <div className={`flex gap-2 ${className}`}>
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          leftIcon={searchIcon}
          rightIcon={clearIcon}
          disabled={disabled}
          inputSize={size}
          variant={variant}
          className="flex-1"
        />
        <Button
          onClick={handleSearch}
          disabled={disabled || !value}
          size={size}
          variant="primary"
        >
          Search
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        leftIcon={searchIcon}
        rightIcon={clearIcon}
        disabled={disabled}
        inputSize={size}
        variant={variant}
      />
    </div>
  );
};

export default SearchBox;