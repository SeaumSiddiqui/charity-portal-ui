import React, { useState, useEffect } from 'react';
import { FileSignature, CheckCircle, User, Shield, Eye, Award, Clock } from 'lucide-react';
import { Verification } from '../../../types';
import { userService } from '../../../services/userService';

interface VerificationFormProps {
  data: Verification;
}

interface SignatureData {
  userId: string;
  userName: string;
  signatureUrl: string | null;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({ data }) => {
  const [signatures, setSignatures] = useState<Record<string, SignatureData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log('[VerificationForm] Verification data:', data);

    const fetchSignatureData = async (userId: string, key: string) => {
      if (!userId) return;

      console.log(`[VerificationForm] Fetching signature for ${key}:`, userId);
      setLoading(prev => ({ ...prev, [key]: true }));

      try {
        const profile = await userService.getUserProfile(userId);
        console.log(`[VerificationForm] Profile loaded for ${key}:`, profile);

        let signatureUrl = null;
        try {
          signatureUrl = await userService.getUserSignatureUrl(userId);
          console.log(`[VerificationForm] Signature URL for ${key}:`, signatureUrl);
        } catch (error) {
          console.log(`[VerificationForm] No signature found for ${key}:`, userId);
        }

        setSignatures(prev => ({
          ...prev,
          [key]: {
            userId,
            userName: profile.username || 'Unknown User',
            signatureUrl
          }
        }));
        console.log(`[VerificationForm] Signature data loaded for ${key}:`, { userId, userName: profile.username, hasSignature: !!signatureUrl });
      } catch (error) {
        console.error(`[VerificationForm] Error fetching signature data for ${key}:`, error);
      } finally {
        setLoading(prev => ({ ...prev, [key]: false }));
      }
    };

    if (data?.agentUserId) {
      fetchSignatureData(data.agentUserId, 'agent');
    }
    if (data?.authenticatorUserId) {
      fetchSignatureData(data.authenticatorUserId, 'authenticator');
    }
    if (data?.investigatorUserId) {
      fetchSignatureData(data.investigatorUserId, 'investigator');
    }
    if (data?.qcSwdUserId) {
      fetchSignatureData(data.qcSwdUserId, 'qcSwd');
    }
  }, [data?.agentUserId, data?.authenticatorUserId, data?.investigatorUserId, data?.qcSwdUserId]);

  const signatureSections = [
    {
      key: 'agentUserId',
      dataKey: 'agent',
      title: 'Agent',
      description: 'Captured when application is created',
      color: 'blue',
      icon: User,
    },
    {
      key: 'authenticatorUserId',
      dataKey: 'authenticator',
      title: 'Authenticator',
      description: 'Captured when status changes to Accepted/Rejected',
      color: 'green',
      icon: Shield,
    },
    {
      key: 'investigatorUserId',
      dataKey: 'investigator',
      title: 'Investigator',
      description: 'Captured when status changes to Granted',
      color: 'purple',
      icon: Eye,
    },
    {
      key: 'qcSwdUserId',
      dataKey: 'qcSwd',
      title: 'QC SWD',
      description: 'Final verification from Qatar Charity Social Welfare Department',
      color: 'orange',
      icon: Award,
    }
  ] as const;

  const completedCount = signatureSections.filter(section => data?.[section.key as keyof Verification]).length;
  const progressPercentage = (completedCount / signatureSections.length) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <FileSignature className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Verification & Signatures</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Digital signatures captured automatically during workflow</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Verification Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {completedCount} of {signatureSections.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Completion</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
                {Math.round(progressPercentage)}%
              </p>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {signatureSections.map((section) => {
          const IconComponent = section.icon;
          const userId = data?.[section.key as keyof Verification];
          const signatureData = signatures[section.dataKey];
          const isLoading = loading[section.dataKey];
          const hasSignature = !!userId;

          const colorClasses = {
            blue: {
              bg: 'bg-blue-100 dark:bg-blue-900/30',
              text: 'text-blue-600 dark:text-blue-400',
              border: 'border-blue-200 dark:border-blue-700',
              badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            },
            green: {
              bg: 'bg-green-100 dark:bg-green-900/30',
              text: 'text-green-600 dark:text-green-400',
              border: 'border-green-200 dark:border-green-700',
              badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            },
            purple: {
              bg: 'bg-purple-100 dark:bg-purple-900/30',
              text: 'text-purple-600 dark:text-purple-400',
              border: 'border-purple-200 dark:border-purple-700',
              badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
            },
            orange: {
              bg: 'bg-orange-100 dark:bg-orange-900/30',
              text: 'text-orange-600 dark:text-orange-400',
              border: 'border-orange-200 dark:border-orange-700',
              badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
            }
          };

          const colors = colorClasses[section.color];

          return (
            <div
              key={section.key}
              className={`bg-white dark:bg-gray-800 rounded-lg border-2 transition-all overflow-hidden ${
                hasSignature ? colors.border : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex items-center justify-center w-10 h-10 ${colors.bg} rounded-lg`}>
                      <IconComponent className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">{section.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{section.description}</p>
                    </div>
                  </div>
                  {hasSignature && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${colors.badge}`}>
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold">Verified</span>
                    </div>
                  )}
                </div>

                {hasSignature ? (
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-10">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-7 h-7 border-3 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">Loading signature...</p>
                        </div>
                      </div>
                    ) : signatureData ? (
                      <>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2.5">
                            <div className={`flex items-center justify-center w-8 h-8 ${colors.bg} rounded-lg`}>
                              <User className={`h-4 w-4 ${colors.text}`} />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">User ID</p>
                              <p className="text-xs font-mono font-semibold text-gray-900 dark:text-white">
                                {signatureData.userId}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Signed by</p>
                          <p className="text-base font-bold text-gray-900 dark:text-white">
                            {signatureData.userName}
                          </p>
                        </div>

                        {signatureData.signatureUrl ? (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Digital Signature
                            </p>
                            <div className="relative group">
                              <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                                <div className="p-5 flex items-center justify-center min-h-[140px]">
                                  <img
                                    src={signatureData.signatureUrl}
                                    alt={`${section.title} Signature`}
                                    className="max-w-full max-h-[120px] object-contain"
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => window.open(signatureData.signatureUrl!, '_blank')}
                                className={`absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-105 border border-gray-200 dark:border-gray-700 ${colors.text}`}
                                title="View full signature"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-900/50">
                            <FileSignature className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              No Signature Available
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              User has not uploaded a signature
                            </p>
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center justify-center w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Clock className="h-7 w-7 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Pending Verification</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Will be captured during workflow
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
