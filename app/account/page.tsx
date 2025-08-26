import { createClient } from "@/lib/supabase/server";
import { User } from "@/app/utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/header";
import QuickContact from "@/components/quickContact";
import ProfileForm from "@/components/profileForm";
import EditAccount from "@/components/editAccount";

export default async function Account() {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();
    const { data: userData } = await supabase.from("users").select("*").eq("email", user?.user?.email).single() as { data: User };

    const completeProfile = () => {
        if (userData.first_name && userData.last_name) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div>
            {/* Page Header */}
            <Header
                currentPage="Mi Cuenta"
                title="Mi Cuenta"
                description={completeProfile() ?
                    "Gestiona tu información personal y preferencias de cuenta." :
                    "Completa tu perfil para acceder a todas las funcionalidades."
                }
                count={completeProfile() ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                countDescription="Perfil Completado"
            />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {completeProfile() ? (
                    /* User Profile Display */
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-r from-percussion to-percussion/50 px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-white text-2xl"
                                        />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-white">
                                            {userData.first_name} {userData.last_name}
                                        </h1>

                                    </div>
                                </div>

                            </div>
                        </div>

                        <EditAccount userData={userData} />
                    </div>
                ) : (
                    /* Complete Profile Form */
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="text-white text-2xl"
                                    />
                                </div>
                                <h1 className="text-2xl font-bold text-white">
                                    Completa tu Perfil
                                </h1>
                                <p className="text-orange-100 mt-2">
                                    Necesitamos algunos datos para personalizar tu experiencia
                                </p>
                            </div>
                        </div>

                        <ProfileForm userData={userData} />

                    </div>
                )}
            </div>

            {/* Quick Contact */}
            <QuickContact />
        </div>
    );
}