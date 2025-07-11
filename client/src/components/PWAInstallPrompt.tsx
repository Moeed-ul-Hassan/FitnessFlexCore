import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Smartphone, Download } from "lucide-react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      
      // Show the install prompt
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember user's choice for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already dismissed this session
  if (sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 p-4"
        >
          <Card className="bg-gradient-to-r from-gym-primary to-gym-secondary border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      🚀 Install GYMISCTIC for faster access
                    </h3>
                    <p className="text-white/80 text-sm">
                      Get the full app experience with offline access
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleInstallClick}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Install Now
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Maybe Later
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/10 p-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
