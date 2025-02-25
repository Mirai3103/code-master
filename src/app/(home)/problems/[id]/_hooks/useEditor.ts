// hooks/useEditor.ts
import { useRef, useState, useEffect, useCallback } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { useMonaco } from "@monaco-editor/react";
import { LanguageOfProblem } from "../types";

export function useEditor(languagesOfProblem: LanguageOfProblem[]) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    languagesOfProblem?.[0]?.monacoCodeLanguage || "plaintext",
  );
  const [isTestResultOpen, setIsTestResultOpen] = useState(false);
  const codePanelRef = useRef<ImperativePanelHandle>(null);
  const monaco = useMonaco();

  // Handle collapse state change
  const handleChangeCollapse = useCallback((isOpen: boolean) => {
    setIsTestResultOpen(isOpen);
    if (codePanelRef.current) {
      if (!isOpen) codePanelRef.current.resize(93);
      else if (codePanelRef.current.getSize() > 71)
        codePanelRef.current.resize(50);
    }
  }, []);

  // Set initial code when language changes
  useEffect(() => {
    languagesOfProblem.forEach((lang) => {
      if (lang.monacoCodeLanguage === selectedLanguage) {
        (monaco?.editor as any)
          ?.getEditors()?.[0]
          ?.setValue(lang.templateCode || "");
      }
    });
  }, [monaco, selectedLanguage, languagesOfProblem]);

  // Get current code from editor
  const getCurrentCode = useCallback(() => {
    return (monaco?.editor as any)?.getEditors()[0].getValue();
  }, [monaco]);

  // Get current selected language object
  const getSelectedLanguageObject = useCallback(() => {
    return languagesOfProblem.find(
      (lang) => lang.monacoCodeLanguage === selectedLanguage,
    );
  }, [selectedLanguage, languagesOfProblem]);

  return {
    selectedLanguage,
    setSelectedLanguage,
    isTestResultOpen,
    codePanelRef,
    handleChangeCollapse,
    getCurrentCode,
    getSelectedLanguageObject,
  };
}
